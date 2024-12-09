import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Evt } from 'src/models/evt';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  form!: FormGroup;
  isEditMode: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Evt | null
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.data) {
      this.isEditMode = true;
      // Parse the dates correctly
      const startDate = this.parseDate(this.data.dateDebut);
      const endDate = this.parseDate(this.data.dateFin);
      
      this.form.patchValue({
        id: this.data.id,
        titre: this.data.titre,
        dateDebut: startDate,
        dateFin: endDate
      });
    }
  }

  parseDate(dateStr: string): Date {
    // Handle different date formats
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    return new Date(dateStr);
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  initForm(): void {
    this.form = new FormGroup({
      id: new FormControl('', [Validators.required]),
      titre: new FormControl('', [Validators.required]),
      dateDebut: new FormControl(null, [Validators.required]),
      dateFin: new FormControl(null, [Validators.required])
    });
  }

  save(): void {
    if (this.form.valid) {
      const formValue = {
        ...this.form.value,
        dateDebut: this.formatDate(this.form.value.dateDebut),
        dateFin: this.formatDate(this.form.value.dateFin)
      };
      this.dialogRef.close(formValue);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
