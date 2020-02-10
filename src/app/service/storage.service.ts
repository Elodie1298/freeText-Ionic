import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage";
import {isNullOrUndefined} from "util";

@Injectable({
    providedIn: 'root'
})
/**
 * Service that store global variables
 */
export class StorageService {

    static userId: number;

    /**
     * Constructor of Storage service
     * @param storage
     */
    constructor(private storage: Storage) {}


    /**
     * Check if the user is known
     */
    isFirstLaunch(): Promise<any> {
        return new Promise<any>(resolve => {
            this.storage.get('userId')
                .then((userId: number) => {
                    if (userId) {
                        StorageService.userId = userId;
                    }
                    console.log(userId);
                    resolve(isNullOrUndefined(userId));
                });
        });
    }


    /**
     * Set the user id
     * @param userId
     */
    setUserId(userId: number): Promise<any> {
        StorageService.userId = userId;
        return this.storage.set('userId', userId);
    }

    /**
     * Get the user id
     */
    getUserId(): Promise<number> {
        return this.storage.get('userId');
    }


    /**
     * Update the last conversation synchronisation timestamp
     */
    setConversationSynchroTime(): Promise<any> {
        return this.storage.set('conversationSynchroTime', new Date());
    }

    /**
     * Get the last conversation synchronisation timestamp
     */
    getConversationSynchroTime(): Promise<any> {
        return this.storage.get('conversationSynchroTime');
    }


    /**
     * Update the last message synchronisation timestamp
     */
    setMessageSynchroTime(): Promise<any> {
        return this.storage.set('messageSynchroTime', new Date());
    }

    /**
     * Get the last message synchronisation timestamp
     */
    getMessageSynchroTime(): Promise<any> {
        return this.storage.get('messageSynchroTime');
    }


    /**
     * Update the last participant synchronisation timestamp
     */
    setParticipantSynchroTime(): Promise<any> {
        return this.storage.set('participantSynchroTime', new Date());
    }

    /**
     * Get the last participant synchronisation timestamp
     */
    getParticipantSynchroTime(): Promise<any> {
        return this.storage.get('participantSynchroTime');
    }
}
