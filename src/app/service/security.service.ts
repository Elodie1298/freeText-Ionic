import { Injectable } from '@angular/core';
import {AES256} from '@ionic-native/aes-256/ngx';
import {environment} from '../../environments/environment';
import {Message} from '../model/message';

@Injectable({
  providedIn: 'root'
})
/**
 * Service that will encrypt the messages
 */
export class SecurityService {

  /**
   * AES secure key
   */
  private secureKey: string;

  /**
   * AES secure IV
   */
  private secureIV: string;

  /**
   * Constructor
   * @param aes
   */
  constructor(private aes: AES256) {
  }

  /**
   * Generation of the secure key and IV
   */
  async generateSecureKeyAndIV() {
    this.secureKey = aes.utils.utf8.toBytes(
      await this.aes.generateSecureKey(environment.aes_pwd));
    this.secureIV = aes.utils.utf8.toBytes(
      await this.aes.generateSecureIV(environment.aes_pwd));
    console.log('generated');
    console.log(this.secureKey);
    console.log(this.secureIV);
  }

  /**
   * Encrypt data
   * @param message
   */
  async encrypt(message: Message): Promise<Message> {
    // message.content = await this.aes
    //   .encrypt(this.secureKey, this.secureIV, message.content);
    console.log(aes);
    let aesCbc = aes.ModeOfOperation.cdc(this.secureKey, this.secureIV);
    message.content = aes.utils.utf8.fromBytes(
      aesCbc.encrypt(aes.utils.utf.toBytes(message.content))
    );
    return message;
  }

  /**
   * Decrypt data
   * @param message
   */
  async decrypt(message: Message): Promise<Message> {
    console.log(message.content);
    this.encrypt(message)
      .then(res => console.log(res.content));

    let aesCbc = aes.ModeOfOperation.cdc(this.secureKey, this.secureIV);
    message.content = aes.utils.utf8.fromBytes(
      aesCbc.decrypt(aes.utils.utf.toBytes(message.content))
    );
    return message
    // return this.aes.decrypt(this.secureKey, this.secureIV, message.content)
    //   .then(content => {
    //     message.content = content;
    //     return message;
    //   });
  }
}
