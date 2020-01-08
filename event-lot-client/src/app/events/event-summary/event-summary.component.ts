import { Component, OnInit, OnChanges,
  Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-event-summary',
  templateUrl: './event-summary.component.html',
  styleUrls: ['./event-summary.component.scss']
})
export class EventSummaryComponent implements OnInit {
  @Input() eventFormData: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  displayedColumns = ['index', 'content', 'status'];
  dataSource: MatTableDataSource<any>;

  constructor() { }

  ngOnInit() { }

  ngOnChanges() {
    if (this.eventFormData && this.eventFormData.checklist) {
      this.dataSource = new MatTableDataSource<any>(this.eventFormData.checklist.checklist);
      this.dataSource.paginator = this.paginator;
    }
  }
}
