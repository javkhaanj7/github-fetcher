import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Apollo } from 'apollo-angular';
import { Subject } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faUser, faInfo, faSpinner } from '@fortawesome/free-solid-svg-icons';

import { fetchQl } from '../state/query';
import { NodeInfo } from '../state/node-info.interface';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public loading: boolean;
  public owner = 'angular';
  public name = 'angular';
  public branch = 'master';
  public api = 'github';
  public form: FormGroup;
  public nodeList: NodeInfo[];
  public fetched: boolean;

  private submitted: boolean;
  private unsubscribe = new Subject<void>();
  private errorMessage = 'Something went wrong.';
  private successMessage = 'Successfully updated.';

  constructor(
    private apollo: Apollo,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private library: FaIconLibrary,
    private apiService: ApiService
  ) {
    this.library.addIcons(faGithub, faStar, faUser, faInfo, faSpinner);
  }

  ngOnInit() {
    this.form = this.fb.group({
      token: [null, Validators.required],
      perPage: [25, Validators.required]
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public valid(control: string): boolean {
    if (!this.form.get(control) || this.form.get(control).disabled || !this.submitted) {
      return true;
    }
    return this.form.get(control).valid;
  }

  onSubmit() {
    this.nodeList = [];
    this.submitted = true;
    if (this.form.valid && this.owner && this.name && this.branch) {
      this.loading = true;
      const value = this.form.value;
      if (this.api === 'github') {
        this.githubAPI(value.token, value.perPage);
      } else {
        this.apiService.fetch({
          owner: this.owner.trim(),
          name: this.name.trim(),
          branch: this.branch.trim(),
          token: value.token.trim(),
          perPage: value.perPage
        }).subscribe((res) => {
          if (res && res.body) {
            this.initList(res.body);
          }
        }, (err) => {
          this.toastr.error(err && err.message ? err.message : this.errorMessage);
          this.loading = false;
        });
      }
    }
  }

  githubAPI(token, first = 25) {
    this.apollo.watchQuery<any>({
      query: fetchQl(this.owner, this.name, this.branch, first),
      errorPolicy: 'all',
      context: {
        headers: new HttpHeaders().set('Authorization', `bearer ${token}`),
      }
    }).valueChanges.pipe(
      takeUntil(this.unsubscribe),
      catchError((err): any => {
        this.toastr.error(err ? err.message : this.errorMessage);
        this.loading = false;
      })
    ).subscribe((res: any) => {
      this.initList(res);
    });
  }

  initList(res: any) {
    if (res && res.data && res.data.repository && res.data.repository.ref && res.data.repository.ref.target.history.edges) {
      res.data.repository.ref.target.history.edges.forEach((entry) => {
        if (entry && entry.node) {
          this.nodeList.push({
            status: entry.node.status,
            messageHeadline: entry.node.messageHeadline,
            oid: entry.node.oid,
            commitUrl: entry.node.commitUrl,
            committedDate: entry.node.committedDate,
            committer: entry.node.committer
          });
        }
      });
    }
    this.fetched = true;
    this.loading = false;
    this.toastr.success(this.successMessage);
  }

}
