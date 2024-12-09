import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MemberService } from 'src/services/member.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from 'src/modeles/Member';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css'],
})
export class MemberFormComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private memberService: MemberService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    // Initialize the form in constructor
    this.form = new FormGroup({
      cin: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      cv: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    const idCourant = this.activatedRoute.snapshot.params['id'];
    console.log('Current ID:', idCourant);
    if (!!idCourant) {
      this.memberService.getMemberByID(idCourant).subscribe((member: Member) => {
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
        name: member.name,
        cv: member.cv,
        type: member.type
      });
      console.log('Form values after patch:', this.form.value);
    }
  }

  sub(): void {
    if (!this.form.valid) {
      return;
    }
    
    const idCourant = this.activatedRoute.snapshot.params['id'];
    const formData = {
      ...this.form.value,
      createdDate: new Date().toISOString(),
    };

    if (!!idCourant) {
      this.memberService.updateMember(idCourant, formData).subscribe(() => {
        this.router.navigate(['/member']);
      });
    } else {
      this.memberService.add(formData).subscribe(() => {
        this.router.navigate(['/member']);
      });
    }
  }
}
