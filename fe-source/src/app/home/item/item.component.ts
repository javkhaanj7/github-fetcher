import { Component, OnInit, Input } from '@angular/core';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';

import { NodeInfo } from '../../state/node-info.interface';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  @Input()
  public node: NodeInfo;

  constructor(
    private library: FaIconLibrary
  ) {
    this.library.addIcons(faTimes, faCheck);
  }

  ngOnInit() {
  }

  successStatus(status) {
    return status.state === 'SUCCESS';
  }

  parsedDate(committedDate) {
    if (committedDate) {
      const date = moment(committedDate);
      if (moment().diff(date, 'days') > 30) {
        return date.format('ll');
      }
      return date.fromNow();
    }
  }

}
