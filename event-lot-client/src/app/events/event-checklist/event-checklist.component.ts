import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ChecklistItem, EventStatus } from '../../_models/event';

@Component({
  selector: 'app-event-checklist',
  templateUrl: './event-checklist.component.html',
  styleUrls: ['./event-checklist.component.scss']
})

export class EventChecklistComponent implements OnInit {
  displayedColumns: string[] = ['select', 'index', 'content', 'status', 'operations'];
  checklist: ChecklistItem[] = [];
  dataSource = new MatTableDataSource<ChecklistItem>(this.checklist);
  dialogData: ChecklistItem;

  @ViewChild(MatTable, { static: false }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private _checklistDialog: MatDialog
  ) {
    this.dialogData = new ChecklistItem;
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  selection = new SelectionModel<ChecklistItem>(true, []);
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: ChecklistItem): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  openDialog(type: string, event: any) {
    if (type == 'add') {
      this._openDialog(type, {}, {});
    } else if (type == 'update' || type == 'view') {
      let item = this.checklist[event];
      this._openDialog(
        type,
        { content: item.content, status: item.status },
        { index: event }
      );
    } else if (type == 'remove') {
      this._openDialog(type, {}, { index: [event] });
    }
  }

  deleteItems() {
    let toBeDeleted: number[] = [];
    this.selection.selected.map((obj) => {
      const index = this.checklist.findIndex(
        ele => ele.content === obj.content && ele.status === obj.status
      );
      if (index >= 0) toBeDeleted.push(index);
    });
    if (toBeDeleted.length > 0)
      this._openDialog('remove', {}, { index: toBeDeleted, reset: 'selection' });
  }

  private _openDialog(type: string, value: any, extra: any) {
    const dialogRef = this._checklistDialog.open(
      EventChecklistDialog, { data: { type: type, value: value }}
    );
    dialogRef.afterClosed().subscribe(result => {
      if (type === 'add' && result && result.content && result.status) {
        this.checklist.unshift({
          content: result.content, status: result.status
        });
      } else if (type === 'update' && result && result.content && result.status) {
        this.checklist[extra.index] = {
          content: result.content, status: result.status
        }
      } else if (type === 'remove' && result === 'ok') {
        this._deleteItems(extra.index);
        if (extra.reset && extra.reset == 'selection')
          this.selection.clear();
      }

      if (type != 'view')
        this.table.renderRows();
    });
  }

  private _deleteItems(indexes: number[]) {
    indexes
      .sort((l, r) => r - l)
      .forEach(index => this.checklist.splice(index, 1));
  }
}

@Component({
  selector: 'app-event-checklist-dialog',
  templateUrl: './event-checklist-dialog.html',
  styleUrls: ['./event-checklist.component.scss']
})
export class EventChecklistDialog implements OnInit{
  cacheData: any;
  retnData: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<EventChecklistDialog>
  ) {
    this._dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.cacheData = this.data.value;
    this.retnData = this.data.value;

    if (this.data.type == 'add') {
      this.retnData = { content: '', status: 'ongoing' };
    } else if (this.data.type == 'update' || this.data.type == 'view') {
      if (this.data.value.status == EventStatus.Checked)
        this.retnData.status = 'checked';
      else
        this.retnData.status = 'ongoing';
    }
  }

  submit(): void {
    if (this.data.type == 'add' || this.data.type == 'update') {
      if (this.retnData.status == 'checked')
        this.retnData.status = EventStatus.Checked;
      else
        this.retnData.status = EventStatus.Ongoing;
    } else if (this.data.type == 'remove') {
      this.retnData = 'ok';
    }
    this._dialogRef.close(this.retnData);
  }

  cancel(): void {
    this._dialogRef.close(undefined);
  }
}
