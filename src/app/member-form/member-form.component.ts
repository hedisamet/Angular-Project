import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MemberService } from 'src/services/member.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from 'src/modeles/Member';
import { DatePipe } from '@angular/common';
import { ErrorStateMatcher } from '@angular/material/core';
import { MyErrorStateMatcher } from 'src/services/my-error-state-matcher';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css'],
  providers: [DatePipe]
})
export class MemberFormComponent implements OnInit {
  form!: FormGroup;
  id!: string;
  matcher = new MyErrorStateMatcher();

  constructor(
    private memberService: MemberService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe
  ) {
    // Initialize the form in constructor
    this.form = new FormGroup({
      cin: new FormControl('', [Validators.required]),
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      dateNaissance: new FormControl('', [Validators.required]),
      cv: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    console.log('Current ID:', this.id);
    if (!!this.id) {
      this.memberService.getMemberByID(this.id).subscribe((member: Member) => {
        console.log('Retrieved member:', member);
        this.editForm(member);
      });
    }
  }

  editForm(member: Member): void {
    console.log('Editing form with member:', member);
    if (member) {
      this.form.patchValue({
        cin: member.cin,
        nom: member.nom,
        prenom: member.prenom,
        dateNaissance: member.dateNaissance,
        type: member.type,
        cv: member.cv
      });
      console.log('Form values after patch:', this.form.value);
    }
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }
    
    const memberData = { ...this.form.value };
    // Format the date as dd/MM/yyyy before sending to server
    const date = new Date(memberData.dateNaissance);
    memberData.dateNaissance = this.datePipe.transform(date, 'dd/MM/yyyy');
    memberData.createdDate = new Date().toISOString();
    
    if (!!this.id) {
      this.memberService.updateMember(this.id, memberData).subscribe(() => {
        this.router.navigate(['/member']);
      });
    } else {
      this.memberService.add(memberData).subscribe(() => {
        this.router.navigate(['/member']);
      });
    }
  }
}
