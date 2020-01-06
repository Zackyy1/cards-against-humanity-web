import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby/lobby.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { EntryComponent } from './entry/entry.component';
import { CookieService } from 'ngx-cookie-service'
import { environment } from 'src/environments/environment';
// import * as fs from 'fs'

const env_url = environment.url
console.log('Listening on', env_url)

var config: SocketIoConfig = { url: env_url, 
  options: {
    // transports: ['websocket'],
    ca: `-----BEGIN CERTIFICATE-----
    MIIF1TCCBL2gAwIBAgIRAN+22qFx7DYSl1YPJc6ZQlUwDQYJKoZIhvcNAQELBQAw
    gY8xCzAJBgNVBAYTAkdCMRswGQYDVQQIExJHcmVhdGVyIE1hbmNoZXN0ZXIxEDAO
    BgNVBAcTB1NhbGZvcmQxGDAWBgNVBAoTD1NlY3RpZ28gTGltaXRlZDE3MDUGA1UE
    AxMuU2VjdGlnbyBSU0EgRG9tYWluIFZhbGlkYXRpb24gU2VjdXJlIFNlcnZlciBD
    QTAeFw0yMDAxMDQwMDAwMDBaFw0yMTAxMDMyMzU5NTlaMCAxHjAcBgNVBAMTFWNh
    cmRzLnJlbmRlbWVudGFsLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
    ggEBAKzKQv2guuho2iu02MgDq3DgY9Oavy3w8BbfyK0dWA2u3HDFB9HKLBvnZTY5
    422i9j0D3ecqEV/RFLCMJOzx26W4oFjX490ZIITGOM5pAAJcHA8D4tNRRckhbz3a
    GbihfNwFwQ3nf0GrlLieDjLCrEU42b0gdKUD1IAabrrJ7rA1Vfc/17memdyGCGnI
    CNVjXP9nzYXj1Sg/5so05nNKlX7VB2eOq7VtGytNSazy+DMBwPGyqMLtPkTICYnW
    FnmIiDf0N1nP370VsNkgfdm6MFkJpEnc8wlipsmQ4t5SGJs3gKihqFrctDEHsx7h
    jmTs3V7zjPq+d7emL7/Yvs84qHkCAwEAAaOCApgwggKUMB8GA1UdIwQYMBaAFI2M
    XsRUrYrhd+mb+ZsF4bgBjWHhMB0GA1UdDgQWBBTyIfIuc0fAa5hqy+pS2HTyrVqN
    szAOBgNVHQ8BAf8EBAMCBaAwDAYDVR0TAQH/BAIwADAdBgNVHSUEFjAUBggrBgEF
    BQcDAQYIKwYBBQUHAwIwSQYDVR0gBEIwQDA0BgsrBgEEAbIxAQICBzAlMCMGCCsG
    AQUFBwIBFhdodHRwczovL3NlY3RpZ28uY29tL0NQUzAIBgZngQwBAgEwgYQGCCsG
    AQUFBwEBBHgwdjBPBggrBgEFBQcwAoZDaHR0cDovL2NydC5zZWN0aWdvLmNvbS9T
    ZWN0aWdvUlNBRG9tYWluVmFsaWRhdGlvblNlY3VyZVNlcnZlckNBLmNydDAjBggr
    BgEFBQcwAYYXaHR0cDovL29jc3Auc2VjdGlnby5jb20wOwYDVR0RBDQwMoIVY2Fy
    ZHMucmVuZGVtZW50YWwuY29tghl3d3cuY2FyZHMucmVuZGVtZW50YWwuY29tMIIB
    BAYKKwYBBAHWeQIEAgSB9QSB8gDwAHYAfT7y+I//iFVoJMLAyp5SiXkrxQ54CX8u
    apdomX4i8NcAAAFvcfmUSAAABAMARzBFAiA69M3mTVA3WmQ8cnnx5oufqu81RUEM
    rUff5wh4+TgufwIhAJNExUHskPp9G8zTk5j5l6A/smPe3z6LdUQfS4IT1ws4AHYA
    RJRlLrDuzq/EQAfYqP4owNrmgr7YyzG1P9MzlrW2gagAAAFvcfmUMgAABAMARzBF
    AiBJNj5fS0zcihFATEVjeBk+Q1l6jL7EyQRxSxgeatxl0wIhAJ7456b+k37ILhbj
    /p5p8jTpdIR9Pt1v78r70pjO7FdnMA0GCSqGSIb3DQEBCwUAA4IBAQC9x9yu6lBc
    fNIM+pSStO9jI39wCH16a+fKrNIirN/T3t1BHm7qY4SvH0agFjfFLF4/V0m//RAe
    rssO2O7pOsw9W+SaERSlTrpeV2OmG8RKoFxy7n0ReL2MiBPMvJLw5pqRGb5mqK6G
    4LkZjRTLwCLhBsUcoFoamGBqLj3MlFyalZOmqbJhMPpTx8qULts0icjYgqI4QOLn
    sWSk/FcL9MdYYZoIZLvw2nG350U9CNepxuF+tX+uoQKpJoYBorSMJ0juMLrdbrvo
    VeaTaeoEa3vhTmdeL4PZkA5b1BtZTK8meRWpdHVBa9qjqKDvNpqbL1syeQsckDrh
    2rY7xjOBbgkf
    -----END CERTIFICATE-----`,
    rejectUnauthorized: false,
    secure: false,
    
  } 
};
// var config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    LobbyComponent,
    EntryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config)

  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
