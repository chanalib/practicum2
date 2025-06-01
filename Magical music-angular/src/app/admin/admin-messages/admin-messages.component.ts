import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MessageService } from "../../services/message/message.service";
import { Message } from "../../models/message.model";

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './admin-messages.component.html',
  styleUrls: ['./admin-messages.component.css']


})
export class AdminMessagesComponent implements OnInit {
  messages: Message[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.messageService.getMessages().subscribe(data => this.messages = data);
    console.log('AdminMessagesComponent loaded');

  }
}
