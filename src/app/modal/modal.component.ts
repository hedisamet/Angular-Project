import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { evt } from 'src/modeles/Event';

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
    @Inject(MAT_DIALOG_DATA) public data: evt | null
  ) {}

  ngOnInit(): void {
    this.initForm();  // Initialize the form first
    
    if (this.data) {
      this.isEditMode = true;
      // Parse the dates from dd/mm/yyyy format to Date objects
      const startDate = this.parseDate(this.data.dateDebut);
      const endDate = this.parseDate(this.data.dateFin);
    
      this.form.patchValue({
        titre: this.data.titre,
        lieu: this.data.lieu,
        dateDebut: startDate,
        dateFin: endDate
      });
    }
  }

  parseDate(dateStr: string): Date {
    if (!dateStr) return new Date();
    const [day, month, year] = dateStr.split('/').map(num => parseInt(num));
    return new Date(year, month - 1, day);
  }


  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  initForm(): void {
    this.form = new FormGroup({
      lieu: new FormControl('', [Validators.required]),
      titre: new FormControl('', [Validators.required]),
      dateDebut: new FormControl(null, [Validators.required]),
      dateFin: new FormControl(null, [Validators.required])
    });
  }

  save(): void {
    if (this.form.valid) {
      const formValue = {
        ...this.form.value,
        lieu: this.form.value.lieu,
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
