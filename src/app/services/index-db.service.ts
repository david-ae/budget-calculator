import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ExpenseDto } from '../models/expense.dto';
import { WindowRef } from '../windowRef';

@Injectable({
  providedIn: 'root',
})
export class IndexDbService {
  private dbName = 'finance';
  private dbVersion = 1;
  private db!: IDBDatabase;
  private expenseId: number = 1;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private windowRef: WindowRef
  ) {
    this.initDatabase();
  }

  private initDatabase() {
    if (isPlatformBrowser(this.platformId)) {
      const request = this.windowRef.nativeWindow.indexedDB.open(
        this.dbName,
        this.dbVersion
      );

      request.onupgradeneeded = (event: any) => {
        this.db = event.target.result;

        // create object stores for data
        if (!this.db.objectStoreNames.contains('finance')) {
          this.db.createObjectStore('finance', {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
      };

      request.onerror = (event: any) => {
        console.error('Error opening database', event.target.error);
      };
    }
  }

  async addExpense(record: ExpenseDto): Promise<number> {
    const transaction = this.db.transaction(['finance'], 'readwrite');
    const objectStore = transaction.objectStore('finance');

    return new Promise((resolve, reject) => {
      const request = objectStore.add(record);

      request.onsuccess = (event: any) => {
        const id = event.target.result;
        resolve(id);
      };

      request.onerror = (event: any) => {
        console.error('Error adding expense', event.target.error);
        reject(event.target.error);
      };
    });
  }

  getExpense(): Promise<ExpenseDto> {
    const transaction = this.db.transaction(['finance'], 'readonly');
    const objectStore = transaction.objectStore('finance');

    return new Promise((resolve, reject) => {
      const request = objectStore.get(this.expenseId);

      request.onsuccess = (event: any) => {
        const expense = event.target.result as ExpenseDto;
        console.log(expense);
        resolve(expense);
      };

      request.onerror = (event: any) => {
        console.error('Error getting expense', event.target.error);
        reject(event.target.error);
      };
    });
  }
}
