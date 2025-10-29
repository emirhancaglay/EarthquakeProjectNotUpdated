import {ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EarthquakeService } from 'src/app/services/earthquake.service';
import { IconService, IconDirective } from '@ant-design/icons-angular';
import { EarthquakeAlertDropdownComponent } from 'src/app/components/earthquake-alert-dropdown.component';
import {
  BellOutline,
  SettingOutline,
  GiftOutline,
  MessageOutline,
  PhoneOutline,
  CheckCircleOutline,
  LogoutOutline,
  EditOutline,
  UserOutline,
  ProfileOutline,
  WalletOutline,
  QuestionCircleOutline,
  LockOutline,
  CommentOutline,
  UnorderedListOutline,
  ArrowRightOutline,
  GithubOutline,
} from '@ant-design/icons-angular/icons';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-nav-right',
  imports: [IconDirective, RouterModule, NgScrollbarModule, NgbNavModule, NgbDropdownModule,EarthquakeAlertDropdownComponent],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent implements OnInit {
  notifications: Array<{ icon: string; time: string; message: string; subtitle?: string }> = [];

  private iconService = inject(IconService);
  private earthquakeService = inject(EarthquakeService);
  private cd = inject(ChangeDetectorRef);

  constructor() {
    this.iconService.addIcon(
      ...[
        CheckCircleOutline,
        GiftOutline,
        MessageOutline,
        SettingOutline,
        PhoneOutline,
        LogoutOutline,
        UserOutline,
        EditOutline,
        ProfileOutline,
        QuestionCircleOutline,
        LockOutline,
        CommentOutline,
        UnorderedListOutline,
        ArrowRightOutline,
        BellOutline,
        GithubOutline,
        WalletOutline,
      ]
    );
  }

  ngOnInit(): void {
    this.earthquakeService.getEarthquakes().subscribe(data => {
      console.log('Earthquake data:', data);
      this.notifications = data
        .filter(eq => eq.isDangerous)
        .map(eq => ({
          icon: 'bell',
          time: this.calculateTimeAgo(eq.date),
          message: `⚠️ Deprem oldu: ${eq.closestLocationName}, büyüklük ${eq.mag}`,
          subtitle: 'Yakınınızda deprem uyarısı'
        }));
      this.cd.detectChanges();
    });
  }

  calculateTimeAgo(dateTime: string): string {
    const now = new Date();
    const eventTime = new Date(dateTime);
    const diffMs = now.getTime() - eventTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'şimdi';
    if (diffMins < 60) return `${diffMins} dk önce`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours} sa önce`;
  }

  profile = [
    { icon: 'edit', title: 'Edit Profile' },
    { icon: 'user', title: 'View Profile' },
    { icon: 'profile', title: 'Social Profile' },
    { icon: 'wallet', title: 'Billing' },
    { icon: 'logout', title: 'Logout' },
  ];

  setting = [
    { icon: 'question-circle', title: 'Support' },
    { icon: 'user', title: 'Account Settings' },
    { icon: 'lock', title: 'Privacy Center' },
    { icon: 'comment', title: 'Feedback' },
    { icon: 'unordered-list', title: 'History' },
  ];
}
