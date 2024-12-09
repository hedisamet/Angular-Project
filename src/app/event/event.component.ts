import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EvtService } from 'src/services/evt.service';
import { Evt } from 'src/models/evt';
import { ModalComponent } from '../modal/modal.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  dataSource: Evt[] = [];
  displayedColumns: string[] = ['1', '2', '3', '4', '5'];

  constructor(private Es: EvtService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.Es.getAll().pipe(
      map(events => {
        return events.map(event => ({
          ...event,
          dateDebut: event.dateDebut || '',
          dateFin: event.dateFin || ''
        }));
      })
    ).subscribe((events) => {
      console.log('Fetched events:', events);
      this.dataSource = events;
    });
  }

  open(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.position = { top: '50%', left: '50%' };
    dialogConfig.panelClass = 'centered-dialog';
    
    const dialogRef = this.dialog.open(ModalComponent, dialogConfig);
    
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        console.log("Dialog output:", data);
        this.Es.saveData(data).subscribe(() => {
          this.fetch();
        });
      }
    });
  }

  open1(id: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.position = { top: '50%', left: '50%' };
    dialogConfig.panelClass = 'centered-dialog';
    
    this.Es.getEventById(id).subscribe((evt) => {
      dialogConfig.data = evt;
      const dialogRef = this.dialog.open(ModalComponent, dialogConfig);
      
      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.Es.updateEvent(id, data).subscribe(() => {
            this.fetch();
          });
        }
      });
    });
  }

  delete(id: string): void {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      height: '200px',
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.Es.deleteEvent(id).subscribe(() => {
          this.fetch();
        });
      }
    });
  }
}
