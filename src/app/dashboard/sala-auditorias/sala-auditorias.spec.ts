import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaAuditorias } from './sala-auditorias';

describe('SalaAuditorias', () => {
  let component: SalaAuditorias;
  let fixture: ComponentFixture<SalaAuditorias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaAuditorias],
    }).compileComponents();

    fixture = TestBed.createComponent(SalaAuditorias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
