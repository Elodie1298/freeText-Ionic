import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewConversationPage } from './new-conversation.page';

describe('NewConversationPage', () => {
  let component: NewConversationPage;
  let fixture: ComponentFixture<NewConversationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewConversationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewConversationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
