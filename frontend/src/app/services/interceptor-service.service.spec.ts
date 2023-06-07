import { TestBed } from '@angular/core/testing';

import { InterceptorServiceService } from './interceptor-service.service';

describe('InterceptorServiceService', () => {
  let service: InterceptorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterceptorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
