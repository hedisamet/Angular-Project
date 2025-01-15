import { Component, OnInit } from '@angular/core';
import { Member } from 'src/modeles/Member';
import { MemberService } from 'src/services/member.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css'],
  providers: [DatePipe]
})
export class MemberComponent implements OnInit {
  colorControl: any;
  constructor(private MS: MemberService, private dialog: MatDialog, private datePipe: DatePipe) {}
  //decalaration du tableau
  displayedColumns: string[] = [
    'id',
    'cin',
    'nom',
    'prenom',
    'dateNaissance',
    'type',
    'email',
    'cv',
    'createdDate',
    'icons'
  ];
  dataSource: Member[] = [];
  private parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    
    // Try parsing dd/MM/yyyy format first since this is our primary format
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/').map(num => parseInt(num, 10));
      if (day && month && year) {
        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime())) return date;
      }
    }
    
    // Try parsing ISO format as fallback
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) return date;
    
    return null;
  }

  ngOnInit(): void {
    this.MS.getAllMembers().subscribe((data: any) => {
      this.dataSource = data.map((member: any) => {
        // If the date is already in dd/MM/yyyy format, don't transform it
        if (member.dateNaissance && member.dateNaissance.includes('/')) {
          return member;
        }
        
        const parsedDate = this.parseDate(member.dateNaissance);
        return {
          ...member,
          dateNaissance: parsedDate ? 
            this.datePipe.transform(parsedDate, 'dd/MM/yyyy') : 
            'Invalid Date'
        };
      });
    });
  }
  delete(id: string): void {
    //lancer la boite
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      height: '200px',
      width: '300px',
    });
    //attendre le resultat de click
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        //si click = confirm =>
        this.MS.deleteMember(id).subscribe(() => {
          this.MS.getAllMembers().subscribe((data) => {
            this.dataSource = data;
          });
        });
      }
    });
  }
}
