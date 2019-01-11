'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`<nav>
    <ul class="list">
        <li class="title">
            <a href="index.html" data-type="index-link">static-web documentation</a>
        </li>
        <li class="divider"></li>
        ${ isNormalMode ? `<div id="book-search-input" role="search">
    <input type="text" placeholder="Type to search">
</div>
` : '' }
        <li class="chapter">
            <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
            <ul class="links">
                    <li class="link">
                        <a href="overview.html" data-type="chapter-link">
                            <span class="icon ion-ios-keypad"></span>Overview
                        </a>
                    </li>
                    <li class="link">
                        <a href="index.html" data-type="chapter-link">
                            <span class="icon ion-ios-paper"></span>README
                        </a>
                    </li>
                    <li class="link">
                        <a href="dependencies.html"
                            data-type="chapter-link">
                            <span class="icon ion-ios-list"></span>Dependencies
                        </a>
                    </li>
            </ul>
        </li>
        <li class="chapter modules">
            <a data-type="chapter-link" href="modules.html">
                <div class="menu-toggler linked" data-toggle="collapse"
                    ${ isNormalMode ? 'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                    <span class="icon ion-ios-archive"></span>
                    <span class="link-name">Modules</span>
                    <span class="icon ion-ios-arrow-down"></span>
                </div>
            </a>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                    <li class="link">
                        <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-AppModule-e057a39ad50447899ea96d4b80c4e6f0"' : 'data-target="#xs-components-links-module-AppModule-e057a39ad50447899ea96d4b80c4e6f0"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-AppModule-e057a39ad50447899ea96d4b80c4e6f0"' : 'id="xs-components-links-module-AppModule-e057a39ad50447899ea96d4b80c4e6f0"' }>
                                        <li class="link">
                                            <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/CoreModule.html" data-type="entity-link">CoreModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/ErrorModule.html" data-type="entity-link">ErrorModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-ErrorModule-d4f21c0f53096259ce1720450be6096d"' : 'data-target="#xs-components-links-module-ErrorModule-d4f21c0f53096259ce1720450be6096d"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-ErrorModule-d4f21c0f53096259ce1720450be6096d"' : 'id="xs-components-links-module-ErrorModule-d4f21c0f53096259ce1720450be6096d"' }>
                                        <li class="link">
                                            <a href="components/ErrorPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ErrorPage</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/ForgotPasswordModule.html" data-type="entity-link">ForgotPasswordModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-ForgotPasswordModule-8c57fae13305fb1295deed94918a163b"' : 'data-target="#xs-components-links-module-ForgotPasswordModule-8c57fae13305fb1295deed94918a163b"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-ForgotPasswordModule-8c57fae13305fb1295deed94918a163b"' : 'id="xs-components-links-module-ForgotPasswordModule-8c57fae13305fb1295deed94918a163b"' }>
                                        <li class="link">
                                            <a href="components/ForgotPasswordPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ForgotPasswordPage</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/HomeModule.html" data-type="entity-link">HomeModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-HomeModule-98248887595134a1dcc35c947ea296e8"' : 'data-target="#xs-components-links-module-HomeModule-98248887595134a1dcc35c947ea296e8"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-HomeModule-98248887595134a1dcc35c947ea296e8"' : 'id="xs-components-links-module-HomeModule-98248887595134a1dcc35c947ea296e8"' }>
                                        <li class="link">
                                            <a href="components/HomePage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomePage</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/LoginModule.html" data-type="entity-link">LoginModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-LoginModule-e717528c09962b9091fe7cf26f35b289"' : 'data-target="#xs-components-links-module-LoginModule-e717528c09962b9091fe7cf26f35b289"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-LoginModule-e717528c09962b9091fe7cf26f35b289"' : 'id="xs-components-links-module-LoginModule-e717528c09962b9091fe7cf26f35b289"' }>
                                        <li class="link">
                                            <a href="components/LoginPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginPage</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/NewAccountModule.html" data-type="entity-link">NewAccountModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-NewAccountModule-d882600cd1ad2594182d5873bd0d7836"' : 'data-target="#xs-components-links-module-NewAccountModule-d882600cd1ad2594182d5873bd0d7836"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-NewAccountModule-d882600cd1ad2594182d5873bd0d7836"' : 'id="xs-components-links-module-NewAccountModule-d882600cd1ad2594182d5873bd0d7836"' }>
                                        <li class="link">
                                            <a href="components/NewAccountPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">NewAccountPage</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/NotFoundModule.html" data-type="entity-link">NotFoundModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-NotFoundModule-575729cac6b2e121acdcd8dafb4d4ccb"' : 'data-target="#xs-components-links-module-NotFoundModule-575729cac6b2e121acdcd8dafb4d4ccb"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-NotFoundModule-575729cac6b2e121acdcd8dafb4d4ccb"' : 'id="xs-components-links-module-NotFoundModule-575729cac6b2e121acdcd8dafb4d4ccb"' }>
                                        <li class="link">
                                            <a href="components/NotFoundPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">NotFoundPage</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/ThemeModule.html" data-type="entity-link">ThemeModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-ThemeModule-6beea9cc5257b19002aa871ee1d49955"' : 'data-target="#xs-components-links-module-ThemeModule-6beea9cc5257b19002aa871ee1d49955"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-ThemeModule-6beea9cc5257b19002aa871ee1d49955"' : 'id="xs-components-links-module-ThemeModule-6beea9cc5257b19002aa871ee1d49955"' }>
                                        <li class="link">
                                            <a href="components/AlertMessagesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">AlertMessagesComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/ButtonComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ButtonComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/Footer.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">Footer</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/Header.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">Header</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/InputComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">InputComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/NewsDetailDialog.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">NewsDetailDialog</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/ShowErrorValidComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ShowErrorValidComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#pipes-links-module-ThemeModule-6beea9cc5257b19002aa871ee1d49955"' : 'data-target="#xs-pipes-links-module-ThemeModule-6beea9cc5257b19002aa871ee1d49955"' }>
                                    <span class="icon ion-md-add"></span>
                                    <span>Pipes</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="pipes-links-module-ThemeModule-6beea9cc5257b19002aa871ee1d49955"' : 'id="xs-pipes-links-module-ThemeModule-6beea9cc5257b19002aa871ee1d49955"' }>
                                        <li class="link">
                                            <a href="pipes/TranslatePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">TranslatePipe</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/WalletModule.html" data-type="entity-link">WalletModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-WalletModule-2adeae4027b3bb3120bdec4c3f3fc3ba"' : 'data-target="#xs-components-links-module-WalletModule-2adeae4027b3bb3120bdec4c3f3fc3ba"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-WalletModule-2adeae4027b3bb3120bdec4c3f3fc3ba"' : 'id="xs-components-links-module-WalletModule-2adeae4027b3bb3120bdec4c3f3fc3ba"' }>
                                        <li class="link">
                                            <a href="components/MyWalletsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">MyWalletsComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/WalletPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">WalletPage</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/WalletRoutingModule.html" data-type="entity-link">WalletRoutingModule</a>
                    </li>
            </ul>
        </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
            ${ isNormalMode ? 'data-target="#classes-links"' : 'data-target="#xs-classes-links"' }>
                <span class="icon ion-ios-paper"></span>
                <span>Classes</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                    <li class="link">
                        <a href="classes/JSONResponse.html" data-type="entity-link">JSONResponse</a>
                    </li>
                    <li class="link">
                        <a href="classes/PasswordValidation.html" data-type="entity-link">PasswordValidation</a>
                    </li>
                    <li class="link">
                        <a href="classes/User.html" data-type="entity-link">User</a>
                    </li>
                    <li class="link">
                        <a href="classes/ValidateSubmitForm.html" data-type="entity-link">ValidateSubmitForm</a>
                    </li>
            </ul>
        </li>
                <li class="chapter">
                    <div class="simple menu-toggler" data-toggle="collapse"
                        ${ isNormalMode ? 'data-target="#injectables-links"' : 'data-target="#xs-injectables-links"' }>
                        <span class="icon ion-md-arrow-round-down"></span>
                        <span>Injectables</span>
                        <span class="icon ion-ios-arrow-down"></span>
                    </div>
                    <ul class="links collapse"
                    ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                            <li class="link">
                                <a href="injectables/ApiService.html" data-type="entity-link">ApiService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/ErrorHandler.html" data-type="entity-link">ErrorHandler</a>
                            </li>
                            <li class="link">
                                <a href="injectables/IcoService.html" data-type="entity-link">IcoService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/LogService.html" data-type="entity-link">LogService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/NewsService.html" data-type="entity-link">NewsService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/TranslateService.html" data-type="entity-link">TranslateService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/UserService.html" data-type="entity-link">UserService</a>
                            </li>
                    </ul>
                </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
                 ${ isNormalMode ? 'data-target="#guards-links"' : 'data-target="#xs-guards-links"' }>
            <span class="icon ion-ios-lock"></span>
            <span>Guards</span>
            <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
                ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                <li class="link">
                    <a href="guards/AuthGuardService.html" data-type="entity-link">AuthGuardService</a>
                </li>
            </ul>
            </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
            ${ isNormalMode ? 'data-target="#miscellaneous-links"' : 'data-target="#xs-miscellaneous-links"' }>
                <span class="icon ion-ios-cube"></span>
                <span>Miscellaneous</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                    <li class="link">
                      <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                    </li>
                    <li class="link">
                      <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                    </li>
            </ul>
        </li>
            <li class="chapter">
                <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
            </li>
        <li class="chapter">
            <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
        </li>
        <li class="divider"></li>
        <li class="copyright">
                Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.svg" class="img-responsive" data-type="compodoc-logo">
                </a>
        </li>
    </ul>
</nav>`);
        this.innerHTML = tp.strings;
    }
});
