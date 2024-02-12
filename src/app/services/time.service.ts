import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toIST'
})
export class ToISTPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value; // Handle null or empty input

    const date = new Date(value);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return value; // Return the original value if it's not a valid date
    }

    // Convert to IST by adding 5 hours and 30 minutes
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);

    return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  }
}
