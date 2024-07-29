import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  // Expose validator as public static function
  static BudgetUsageValidator(
    baseAmount: number,
    amountUsed: number
  ): ValidatorFn {
    // returns a function which takes an Anstract control as an input
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value) {
        console.log(`baseamount: ${baseAmount}, amountUsed:${amountUsed}`);
        if (baseAmount <= amountUsed) {
          return {
            hasBalance: true,
          };
        }
      }

      return null;
    };
  }
}
