import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {User} from "../model/user";
import {Conversation} from "../model/conversation";
import {StorageService} from "./storage.service";
import {Message} from "../model/message";
import {Participant} from "../model/participant";

@Injectable({
    providedIn: 'root'
})
/**
 * Service that connect to APi endpoints
 * WIP
 */
export class ApiService {

    /**
     * Constructor of ApiService
     * @param http
     * @param storage
     */
    constructor(private http: HttpClient,
                private storage: StorageService) {
    }


    /**
     * Log the user at the app first opening
     * @param name Name of the user
     * @param phoneNumber Phone number of the user
     */
    login(name: string, phoneNumber: string): Promise<number> {
        let url = `${environment.api}/login`;
        let body = new URLSearchParams();
        body.set('name', name);
        body.set('phoneNumber', phoneNumber);
        return this.http.post(url, body.toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).toPromise() as Promise<number>;
    }


    /**
     * Get user's information
     * @param id_user Id of the user
     */
    getUser(id_user: number): Promise<User> {
        let url = `${environment.api}/user?id_user=${id_user}`;
        return this.http.get(url).toPromise() as Promise<User>;
        // TODO: save user in database
    }


    /**
     * Get user's conversations
     */
    getConversations(): Promise<Conversation[]> {
        return this.storage.getUserId()
            .then((userId: number) => {
                let url = `${environment.api}/conversations?id_user=${userId}`;
                return this.http.get(url).toPromise() as Promise<Conversation[]>;
            });
        // TODO: save conversations in real database
        // TODO: save last conversation synchronisation in database
        // TODO: manage get with timestamp
    }


    /**
     * Add new conversation
     * @param conversation Conversation to save
     */
    addConversation(conversation: Conversation) {
        let url = `${environment.api}/conversations`;
        let body = new URLSearchParams();
        body.set('title', conversation.title);
        body.set('timestamp', conversation.timestamp);
        return this.http.post(url, body.toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).toPromise() as Promise<number>;
        // TODO: delete from temp table and save in real one with the insert id
    }


    /**
     * Get user's messages
     */
    getMessages(): Promise<Message[]> {
        return this.storage.getUserId()
            .then((userId: number) => {
                let url = `${environment.api}/messages?id_user=${userId}`;
                return this.http.get(url).toPromise() as Promise<Message[]>;
            });
        // TODO: save conversations in real database
        // TODO: save last message synchronisation in database
        // TODO: manage get with timestamp
    }


    /**
     * Add new message
     * @param message Message to save
     */
    addMessage(message: Message) {
        let url = `${environment.api}/conversations`;
        let body = new URLSearchParams();
        body.set('id_user', message.id_user.toString());
        body.set('id_conversation', message.id_conversation.toString());
        body.set('content', message.content);
        body.set('timestamp', message.timestamp);
        return this.http.post(url, body.toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).toPromise() as Promise<number>;
        // TODO: delete from temp table and save in real one with the insert id
    }


    /**
     * Get user's linked participant
     */
    getParticipants(): Promise<Participant[]> {
        return this.storage.getUserId()
            .then((userId: number) => {
                let url = `${environment.api}/participants?id_user=${userId}`;
                return this.http.get(url).toPromise() as Promise<Participant[]>;
            });
        // TODO: save conversations in real database
        // TODO: save last message synchronisation in database
        // TODO: manage get with timestamp
    }


    /**
     * Add new participant
     * @param participant Participant to save
     */
    addParticipant(participant: Participant) {
        let url = `${environment.api}/participants`;
        let body = new URLSearchParams();
        body.set('id_user', participant.id_user.toString());
        body.set('id_conversation', participant.id_conversation.toString());
        body.set('nickname', participant.nickname);
        body.set('timestamp', participant.timestamp);
        return this.http.post(url, body.toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).toPromise() as Promise<number>;
        // TODO: delete from temp table and save in real one with the insert id
    }
}
