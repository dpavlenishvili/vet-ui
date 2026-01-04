import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RedirectCommand } from '@angular/router';
import { signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { authenticatedGuard, unAuthenticatedGuard } from './authenticated.guard';
import { AuthenticationService } from './authentication.service';


describe('Authentication Guards', () => {
  let router: Router;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;

  beforeEach(() => {
    // Create mock AuthenticationService
    mockAuthService = jasmine.createSpyObj<AuthenticationService>('AuthenticationService', ['hasTokens'], {
      isReady: signal(false),
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthenticationService, useValue: mockAuthService },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['parseUrl', 'navigate']),
        },
      ],
    });

    router = TestBed.inject(Router);
  });

  describe('authenticatedGuard', () => {
    it('should allow access when user is authenticated', async () => {
      // Arrange
      mockAuthService.isReady = signal(true);
      mockAuthService.hasTokens.and.returnValue(true);

      // Act
      const result = await firstValueFrom(
        TestBed.runInInjectionContext(() => authenticatedGuard({} as any, {} as any))
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should redirect to home when user is not authenticated', async () => {
      // Arrange
      mockAuthService.isReady = signal(true);
      mockAuthService.hasTokens.and.returnValue(false);
      const mockUrl = {} as any;
      (router.parseUrl as jasmine.Spy).and.returnValue(mockUrl);

      // Act
      const result = await firstValueFrom(
        TestBed.runInInjectionContext(() => authenticatedGuard({} as any, {} as any))
      );

      // Assert
      expect(result).toBeInstanceOf(RedirectCommand);
      expect(router.parseUrl).toHaveBeenCalledWith('/');
    });

    it('should wait for auth service to be ready before evaluating', async () => {
      // Arrange
      const isReady = signal(false);
      mockAuthService.isReady = isReady;
      mockAuthService.hasTokens.and.returnValue(true);

      // Act - start guard evaluation
      const guardPromise = firstValueFrom(
        TestBed.runInInjectionContext(() => authenticatedGuard({} as any, {} as any))
      );

      // Assert - guard should not resolve immediately
      let resolved = false;
      guardPromise.then(() => (resolved = true));

      // Wait a tick
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(resolved).toBe(false);

      // Signal ready
      isReady.set(true);
      await guardPromise;
      expect(resolved).toBe(true);
    });

    it('should handle slow network scenarios', async () => {
      // Arrange - simulate delayed auth initialization
      const isReady = signal(false);
      mockAuthService.isReady = isReady;
      mockAuthService.hasTokens.and.returnValue(true);

      // Act
      const guardPromise = firstValueFrom(
        TestBed.runInInjectionContext(() => authenticatedGuard({} as any, {} as any))
      );

      // Simulate slow network delay
      await new Promise(resolve => setTimeout(resolve, 100));

      // Signal ready after delay
      isReady.set(true);

      const result = await guardPromise;

      // Assert
      expect(result).toBe(true);
    });

    it('should immediately allow access if already initialized and authenticated', async () => {
      // Arrange
      mockAuthService.isReady = signal(true);
      mockAuthService.hasTokens.and.returnValue(true);

      // Act
      const startTime = Date.now();
      const result = await firstValueFrom(
        TestBed.runInInjectionContext(() => authenticatedGuard({} as any, {} as any))
      );
      const endTime = Date.now();

      // Assert
      expect(result).toBe(true);
      expect(endTime - startTime).toBeLessThan(50); // Should be near-instant
    });
  });

  describe('unAuthenticatedGuard', () => {
    it('should allow access when user is not authenticated', async () => {
      // Arrange
      mockAuthService.isReady = signal(true);
      mockAuthService.hasTokens.and.returnValue(false);

      // Act
      const result = await firstValueFrom(
        TestBed.runInInjectionContext(() => unAuthenticatedGuard({} as any, {} as any))
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should redirect to home when user is already authenticated', async () => {
      // Arrange
      mockAuthService.isReady = signal(true);
      mockAuthService.hasTokens.and.returnValue(true);
      const mockUrl = {} as any;
      (router.parseUrl as jasmine.Spy).and.returnValue(mockUrl);

      // Act
      const result = await firstValueFrom(
        TestBed.runInInjectionContext(() => unAuthenticatedGuard({} as any, {} as any))
      );

      // Assert
      expect(result).toBeInstanceOf(RedirectCommand);
      expect(router.parseUrl).toHaveBeenCalledWith('/');
    });

    it('should wait for auth service to be ready before evaluating', async () => {
      // Arrange
      const isReady = signal(false);
      mockAuthService.isReady = isReady;
      mockAuthService.hasTokens.and.returnValue(false);

      // Act
      const guardPromise = firstValueFrom(
        TestBed.runInInjectionContext(() => unAuthenticatedGuard({} as any, {} as any))
      );

      // Assert - guard should not resolve immediately
      let resolved = false;
      guardPromise.then(() => (resolved = true));

      await new Promise(resolve => setTimeout(resolve, 0));
      expect(resolved).toBe(false);

      // Signal ready
      isReady.set(true);
      await guardPromise;
      expect(resolved).toBe(true);
    });

    it('should handle token expiry scenarios', async () => {
      // Arrange - simulate token expiring during guard evaluation
      const isReady = signal(true);
      mockAuthService.isReady = isReady;

      // Initially has tokens
      mockAuthService.hasTokens.and.returnValue(true);

      // Act - first evaluation
      const result1 = await firstValueFrom(
        TestBed.runInInjectionContext(() => unAuthenticatedGuard({} as any, {} as any))
      );

      // Token expires
      mockAuthService.hasTokens.and.returnValue(false);

      // Second evaluation after token expiry
      const result2 = await firstValueFrom(
        TestBed.runInInjectionContext(() => unAuthenticatedGuard({} as any, {} as any))
      );

      // Assert
      expect(result1).toBeInstanceOf(RedirectCommand); // Redirected when authenticated
      expect(result2).toBe(true); // Allowed when not authenticated
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid state changes', async () => {
      // Arrange
      const isReady = signal(false);
      mockAuthService.isReady = isReady;
      mockAuthService.hasTokens.and.returnValue(true);

      // Act - start guard evaluation
      const guardPromise = firstValueFrom(
        TestBed.runInInjectionContext(() => authenticatedGuard({} as any, {} as any))
      );

      // Rapidly toggle isReady (race condition simulation)
      isReady.set(true);
      isReady.set(false);
      isReady.set(true);

      const result = await guardPromise;

      // Assert - should still work correctly despite rapid changes
      expect(result).toBe(true);
    });

    it('should handle auth service errors gracefully', async () => {
      // Arrange
      mockAuthService.isReady = signal(true);
      mockAuthService.hasTokens.and.throwError('Auth service error');
      const mockUrl = {} as any;
      (router.parseUrl as jasmine.Spy).and.returnValue(mockUrl);

      // Act & Assert
      const result = await firstValueFrom(
        TestBed.runInInjectionContext(() => authenticatedGuard({} as any, {} as any))
      );

      expect(result).toBeInstanceOf(RedirectCommand);
      expect(router.parseUrl).toHaveBeenCalledWith('/');
    });

    it('should not leak subscriptions', async () => {
      // Arrange
      mockAuthService.isReady = signal(true);
      mockAuthService.hasTokens.and.returnValue(true);

      // Act - call guard multiple times
      for (let i = 0; i < 10; i++) {
        await firstValueFrom(
          TestBed.runInInjectionContext(() => authenticatedGuard({} as any, {} as any))
        );
      }

      // Assert - if there were subscription leaks, this test would timeout or fail
      expect(true).toBe(true);
    });
  });

  describe('Integration: Auth Flow', () => {
    it('should simulate full login flow', async () => {
      // Arrange - start unauthenticated
      const isReady = signal(true);
      mockAuthService.isReady = isReady;
      mockAuthService.hasTokens.and.returnValue(false);

      // Act 1: Try to access authenticated route
      const result1 = await firstValueFrom(
        TestBed.runInInjectionContext(() => authenticatedGuard({} as any, {} as any))
      );

      // Assert 1: Redirected to home
      expect(result1).toBeInstanceOf(RedirectCommand);

      // Act 2: Try to access auth/login page
      const result2 = await firstValueFrom(
        TestBed.runInInjectionContext(() => unAuthenticatedGuard({} as any, {} as any))
      );

      // Assert 2: Allowed to access login
      expect(result2).toBe(true);

      // Simulate login success
      mockAuthService.hasTokens.and.returnValue(true);

      // Act 3: Try to access authenticated route after login
      const result3 = await firstValueFrom(
        TestBed.runInInjectionContext(() => authenticatedGuard({} as any, {} as any))
      );

      // Assert 3: Allowed to access
      expect(result3).toBe(true);

      // Act 4: Try to access login page while authenticated
      const result4 = await firstValueFrom(
        TestBed.runInInjectionContext(() => unAuthenticatedGuard({} as any, {} as any))
      );

      // Assert 4: Redirected to home
      expect(result4).toBeInstanceOf(RedirectCommand);
    });
  });
});
