import { Component, OnInit } from '@angular/core';
import { MemberService } from '../../services/member.service';
import { EventService } from '../../services/event.service';
import { Member } from 'src/modeles/Member';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  nb_Members: number = 0;
  nb_Articles: number = 0;
  nb_Events: number = 0;
  nbteacher: number = 0;
  nbstudent: number = 0;

  constructor(
    private memberService: MemberService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.loadMembers();
    this.loadEvents();
  }

  private loadMembers(): void {
    this.memberService.getAllMembers().subscribe((members: Member[]) => {
      this.nb_Members = members.length;
      
      members.forEach((member: Member) => {
        if (member.type === 'teacher') {
          this.nbteacher++;
        } else {
          this.nbstudent++;
        }
      });
    });
  }

  private loadEvents(): void {
    this.eventService.getAllEvent().subscribe((events: any[]) => {
      this.nb_Events = events.length;
    });
  }
}
