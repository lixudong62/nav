// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FormsModule } from '@angular/forms'
import config from '../../nav.config'

import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzRadioModule } from 'ng-zorro-antd/radio'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { NzMessageModule } from 'ng-zorro-antd/message'
import { NzNotificationModule } from 'ng-zorro-antd/notification'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzEmptyModule } from 'ng-zorro-antd/empty'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { ReactiveFormsModule } from '@angular/forms'
import { NzAvatarModule } from 'ng-zorro-antd/avatar'
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm'
import { NzDropDownModule } from 'ng-zorro-antd/dropdown'
import { NzToolTipModule } from 'ng-zorro-antd/tooltip'
import { NzCardModule } from 'ng-zorro-antd/card'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzGridModule } from 'ng-zorro-antd/grid'
import { NzLayoutModule } from 'ng-zorro-antd/layout'
import { NzMenuModule } from 'ng-zorro-antd/menu'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzTabsModule } from 'ng-zorro-antd/tabs'
import { NzDividerModule } from 'ng-zorro-antd/divider'

// components
import { AppComponent } from './app.component'

// views
import LightComponent from '../view/index/light/index.component'
import SimComponent from '../view/index/sim/index.component'
import AdminComponent from '../view/admin/index.component'
import SideComponent from '../view/index/side/index.component'
import WebpComponent from '../view/app/default/app.component'
import { FixbarComponent } from '../components/fixbar/index.component'
import { MultipleSiteComponent } from '../components/multiple-site/index.component'
import { FooterComponent } from '../components/footer/footer.component'
import { IconGitComponent } from '../components/icon-git/icon-git.component'
import { NoDataComponent } from '../components/no-data/no-data.component'
import { SearchEngineComponent } from '../components/search-engine/search-engine.component';
import { CreateComponent } from '../components/create/create.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LogoComponent } from '../components/logo/logo.component';
import { CardComponent } from '../components/card/index.component'

registerLocaleData(zh);

const appRoutes: Routes = [
  { 
    path: 'sim',
    component: SimComponent,
  },
  { 
    path: 'side',
    component: SideComponent,
  },
  { 
    path: 'light',
    component: LightComponent,
    data: {
      renderLinear: true
    }
  },
  { 
    path: 'app',
    component: WebpComponent,
  },
  { 
    path: 'admin',
    component: AdminComponent,
  },
  {
    path: '**',
    redirectTo: '/' + config.theme.toLowerCase(),
  },
]

@NgModule({
  declarations: [
    AppComponent,
    LightComponent,
    SimComponent,
    SideComponent,
    AdminComponent,
    WebpComponent,
    FixbarComponent,
    MultipleSiteComponent,
    FooterComponent,
    IconGitComponent,
    NoDataComponent,
    SearchEngineComponent,
    CreateComponent,
    LogoComponent,
    CardComponent
  ],
  imports: [
    NzModalModule,
    NzInputModule,
    NzRadioModule,
    NzSelectModule,
    NzMessageModule,
    NzNotificationModule,
    NzFormModule,
    NzEmptyModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzAvatarModule,
    NzPopconfirmModule,
    NzDropDownModule,
    NzToolTipModule,
    NzCardModule,
    NzIconModule,
    NzGridModule,
    NzLayoutModule,
    NzMenuModule,
    NzTableModule,
    NzTabsModule,
    NzDividerModule,
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false,     // <-- debugging purposes only
        useHash: config.hashMode,
      }
    ),
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [
    AppComponent,
  ],
})

export class AppModule { }
