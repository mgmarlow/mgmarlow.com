import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Tag } from '../../projects.service';

@Injectable()
export class FilterService {
  private _activeTags: BehaviorSubject<Tag[]> = new BehaviorSubject<Tag[]>(
    [ Tag.Article, Tag.Code ]
  );
  activeTags = this._activeTags.asObservable();

  toggleActive(tag: Tag) {
    let tags: Tag[] = this._activeTags.value;
    const tagIndex = tags.indexOf(tag);
    tags = tagIndex === -1
      ? [ ...tags, tag ]
      : [ ...tags.slice(0, tagIndex), ...tags.slice(tagIndex + 1, tags.length) ]
    this._activeTags.next(tags);
  }
}
