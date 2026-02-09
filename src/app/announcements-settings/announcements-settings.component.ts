import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AnnouncementsService } from "../services/announcements.service";
import { NgIf } from "@angular/common";

@Component({
    selector: 'app-announcements-settings',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NgIf
    ],
    templateUrl: './announcements-settings.component.html',
    styleUrl: './announcements-settings.component.css'
})
export class AnnouncementsSettingsComponent implements OnInit {
    announcementForm: FormGroup = new FormGroup({
        text: new FormControl('')
    });
    saveMessage = '';

    constructor(private announcementsService: AnnouncementsService) { }

    ngOnInit() {
        this.announcementsService.getAnnouncement().subscribe({
            next: (response) => {
                // Handle various response structures depending on API/Local Mock
                const message = response.data?.message || response.message || response || '';
                if (typeof message === 'string') {
                    this.announcementForm.patchValue({ text: message });
                } else if (response.data && typeof response.data === 'string') {
                    this.announcementForm.patchValue({ text: response.data });
                }
            },
            error: (err) => console.error(err)
        });
    }

    saveAnnouncement() {
        this.announcementsService.updateAnnouncement(this.announcementForm.value.text).subscribe({
            next: () => {
                this.saveMessage = 'Announcement updated successfully!';
                setTimeout(() => this.saveMessage = '', 3000);
            },
            error: (err) => console.error(err)
        });
    }
}
