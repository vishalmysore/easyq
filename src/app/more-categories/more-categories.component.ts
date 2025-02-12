import { Component, EventEmitter, Output } from '@angular/core';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-more-categories',
  templateUrl: './more-categories.component.html',
  imports: [
    NgForOf
  ],
  styleUrls: ['./more-categories.component.css']
})
export class MoreCategoriesComponent {
  @Output() closePopup = new EventEmitter<void>();
  @Output() categorySelected = new EventEmitter<string>();

  categories = [
    { name: 'Math', subcategories: ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics'] },
    { name: 'Physics', subcategories: ['Mechanics', 'Optics', 'Thermodynamics', 'Quantum Physics', 'Electromagnetism'] },
    { name: 'Chemistry', subcategories: ['Organic', 'Inorganic', 'Physical', 'Biochemistry', 'Analytical'] },
    { name: 'Biology', subcategories: ['Genetics', 'Microbiology', 'Botany', 'Zoology', 'Human Biology'] },
    { name: 'History', subcategories: ['Ancient History', 'Medieval History', 'Modern History', 'World Wars', 'Revolutions'] },
    { name: 'Geography', subcategories: ['Physical Geography', 'Human Geography', 'Cartography', 'Climatology', 'Geology'] },
    { name: 'Computer Science', subcategories: ['Programming', 'AI & Machine Learning', 'Databases', 'Cybersecurity', 'Networking'] },
    { name: 'Business', subcategories: ['Marketing', 'Finance', 'Entrepreneurship', 'Economics', 'Management'] },
    { name: 'Health & Medicine', subcategories: ['Anatomy', 'Physiology', 'Diseases', 'Surgery', 'Nutrition'] },
    { name: 'Art & Music', subcategories: ['Painting', 'Sculpture', 'Classical Music', 'Jazz & Blues', 'Photography'] },
    { name: 'Sports', subcategories: ['Football', 'Basketball', 'Cricket', 'Tennis', 'Olympics'] },
    { name: 'Philosophy', subcategories: ['Ethics', 'Metaphysics', 'Logic', 'Existentialism', 'Political Philosophy'] }
  ];

  selectCategory(category: string) {
    this.categorySelected.emit(category);
    this.closePopup.emit();
  }

  close() {
    this.closePopup.emit();
  }
}
