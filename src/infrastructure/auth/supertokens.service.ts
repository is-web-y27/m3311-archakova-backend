import { Inject, Injectable } from '@nestjs/common';
import SuperTokens from 'supertokens-node';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';
import { AUTH_MODULE_OPTIONS } from './auth.constants';
import type { AuthModuleOptions } from './auth.types';
import { UserService } from 'src/user/user.service';
import { UserRole } from 'src/user/entities/user-role.enum';

@Injectable()
export class SuperTokensService {
  constructor(
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly options: AuthModuleOptions, private readonly userService: UserService
  ) {
    SuperTokens.init({
      framework: 'express',

      supertokens: {
        connectionURI: this.options.connectionURI,
        apiKey: this.options.apiKey,
      },

      appInfo: {
        appName: this.options.appName,
        apiDomain: this.options.apiDomain,
        websiteDomain: this.options.websiteDomain,
        apiBasePath: '/auth',
        websiteBasePath: '/auth',
      },

      recipeList: [
        EmailPassword.init({signUpFeature: {formFields: [{
            id: 'name', validate: async (value) => {
                if (typeof value !== 'string') {
                    return 'Name must be a string';
                }
                const name = value.trim();

                if (name.length < 2){
                    return 'Name must contain at least 2 characters';
                }

                if (name.length > 100){
                    return 'Name must contain no more than 100 characters';
                }
                return undefined;
            }
        }]}, override: {
            apis: (originalImplementation) => ({
                ...originalImplementation,
            
                signUpPOST: async (input) => {
                    if (!originalImplementation.signUpPOST){
                        throw new Error('SuperTokens signUpPOST is not available');
                    }

                    const response = await originalImplementation.signUpPOST(input);

                    if (response.status === 'OK'){
                        const nameField = input.formFields.find(field => field.id === 'name');

                        const emailField = input.formFields.find(fields => fields.id === 'email');

                        const name = String(nameField?.value ?? '').trim();
                        const email = String(emailField?.value ?? '').trim().toLowerCase();

                        await this.userService.linkOrCreateAuthUser(
                          response.user.id,
                          email,
                          name,
                          this.getRole(email),
                        );
                    
                    }
                    return response;
                },
                signInPOST: async (input) => {
                    if (!originalImplementation.signInPOST) {
                        throw new Error('SuperTokens signInPOST is not available');
                    }

                    const response = await originalImplementation.signInPOST(input);

                    if (response.status === 'OK') {
                        const emailField = input.formFields.find(field => field.id === 'email');
                        const email = String(emailField?.value ?? '').trim().toLowerCase();
                        const fallbackName = email.split('@')[0];

                        await this.userService.linkOrCreateAuthUser(
                          response.user.id,
                          email,
                          fallbackName,
                          this.getRole(email),
                        );
                    }

                    return response;
                },
            }),
        }}),
        Session.init({getTokenTransferMethod: () => 'cookie'}),
      ],
    });
  }

  private getRole(email: string): UserRole {
    return this.options.adminEmails?.includes(email)
      ? UserRole.ADMIN
      : UserRole.USER;
  }
}
