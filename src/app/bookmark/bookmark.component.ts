import { Component } from '@angular/core';

@Component({
  selector: 'app-bookmarklet',
  template: `<div [innerHTML]="bookmarkletHtml"></div>`,
})
export class BookmarkletComponent {
  bookmarkletHtml = `
    <a href="javascript:(function(){var articleUrl=encodeURIComponent(window.location.href);window.open('https://easyqz.online/?url='+articleUrl,'_blank');})()"
       onclick="alert('Drag this link to your bookmarks bar instead of clicking it!'); return false;">
      📖 EasyQz Quiz
    </a>
  `;
}
