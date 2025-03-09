import {TestBed} from "@angular/core/testing";
import {
  HttpClient,
  HttpErrorResponse,
  HttpStatusCode,
  provideHttpClient,
  withFetch,
  withInterceptors
} from "@angular/common/http";
import {authenticationInterceptor} from "./authentication.interceptor";
import {HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";
import {AuthenticationService} from "../authentication.service";
import {firstValueFrom} from "rxjs";
import {useHttpContexts} from "@vet/shared";
import {skipAuthorizationCtx} from "@vet/auth";

const refreshTokenUrl = 'refresh-token-url';

describe('authenticationInterceptor', () => {
  let httpTesting: HttpTestingController;
  let httpClient: HttpClient;
  const skippedAuthorizationCtxOptions = {
    context: useHttpContexts(
      skipAuthorizationCtx()
    )
  };
  const authenticationService = {
    isAuthenticated: jest.fn().mockReturnValue(true),
    accessToken: jest.fn().mockReturnValue('mocked-access-token'),
    refreshToken: jest.fn().mockImplementation(() => httpClient.get(refreshTokenUrl, skippedAuthorizationCtxOptions))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withFetch(),
          withInterceptors([authenticationInterceptor])
        ),
        provideHttpClientTesting(),
        {
          provide: AuthenticationService,
          useValue: authenticationService
        }
      ]
    }).compileComponents();
    httpTesting = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });
  afterEach(() => {
    // Verify that none of the tests make any extra HTTP requests.
    httpTesting.verify();
    jest.clearAllMocks();
  });

  it('should send request with correct access token when there is one', async () => {
    const someRequest = firstValueFrom(httpClient.get('some-url'));
    const req = httpTesting.expectOne('some-url');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mocked-access-token');
    req.flush({});
    await someRequest;
  });

  it('should not send request with bearer token when it is skipped by the context', async () => {
    const someRequest = firstValueFrom(
      httpClient.get('some-url', skippedAuthorizationCtxOptions)
    );
    const req = httpTesting.expectOne('some-url');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
    await someRequest;
  });

  it('should not send request with bearer when there is no token', () => {
    authenticationService.accessToken.mockReturnValueOnce('');
    const someRequest = firstValueFrom(httpClient.get('some-url'));
    const req = httpTesting.expectOne('some-url');
    expect(authenticationService.accessToken).toHaveBeenCalled();
    expect(authenticationService.accessToken).toHaveBeenCalledTimes(1);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
    return someRequest;
  });

  it('should try to refresh token when request fails with 401', async () => {
    const someInitialRequest = firstValueFrom(httpClient.get('some-url'));
    const req = httpTesting.expectOne('some-url');
    req.flush({}, {
      status: HttpStatusCode.Unauthorized,
      statusText: 'Unauthorized'
    });
    const refreshTokenReq = httpTesting.expectOne(refreshTokenUrl);
    refreshTokenReq.flush({});

    const retryReq = httpTesting.expectOne('some-url');
    expect(retryReq.request.headers.get('Authorization')).toBe('Bearer mocked-access-token');
    retryReq.flush({retried: true});

    const result = await someInitialRequest;
    expect(result).toEqual({retried: true});
  });

  it('should not retry refresh if it fails', async () => {
    const someInitialRequest = firstValueFrom(httpClient.get('some-url'));
    const req = httpTesting.expectOne('some-url');
    req.flush({errored: true}, {
      status: HttpStatusCode.Unauthorized,
      statusText: 'Unauthorized'
    });
    const refreshTokenReq = httpTesting.expectOne(refreshTokenUrl);
    refreshTokenReq.flush({}, {
      status: HttpStatusCode.Forbidden,
      statusText: 'Bad Request'
    });
    httpTesting.expectNone('some-url');
    try {
      const resp = await someInitialRequest;
      expect(resp).toBeUndefined();
    } catch (error) {
      expect((error as HttpErrorResponse).status).toBe(HttpStatusCode.Unauthorized);
    }
  });
});
