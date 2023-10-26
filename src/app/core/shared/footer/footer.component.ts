import { Component, OnInit } from '@angular/core';
import { DateService } from '../../services/date/date.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  date!: string;

  constructor(private dateService: DateService) {}

  ngOnInit(): void {
    this.dateService.obtenerDate().subscribe(date => {
      this.date = date;
    });
  }
}
