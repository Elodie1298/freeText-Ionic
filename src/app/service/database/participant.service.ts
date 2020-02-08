import {Injectable} from '@angular/core';
import {Participant} from '../../model/participant';
import {DatabaseService} from './database.service';
import {integerToTimestamp, rowsToList} from '../../app.const';

@Injectable({
    providedIn: 'root'
})
/**
 * Service that manage participants in local database
 */
export class ParticipantService {

    static participants: Participant[];
    static participantsTemp: Participant[];

    /**
     * Update static lists of data
     */
    updateLists(): void {
        DatabaseService.db.executeSql(
            'select * from participant_temp', [])
            .then(result => rowsToList(result.rows))
            .then((participants: Participant[]) =>
                ParticipantService.participantsTemp = participants);
        DatabaseService.db.executeSql(
            'select * from participant', [])
            .then(result => rowsToList(result.rows))
            .then((participants: Participant[]) =>
                ParticipantService.participants = participants);
    }

    /**
     * Get all participant stored in the temporary database
     */
    getAllTemp(): Promise<Participant[]> {
        return DatabaseService.db.executeSql(
            'select * from participant_temp', [])
            .then(result => rowsToList(result.rows));
    }

    /**
     * Insert participant into the appropriate table
     * @param participant
     * @param fromServer
     */
    set(participant: Participant, fromServer: boolean = false): Promise<any> {
        let table = 'participant';
        if (!fromServer) {
            table += '_temp';
        }
        return DatabaseService.db.executeSql(
            `insert into ${table} (id_conversation, id_user, nickname, 
                      timestamp) values (?, ?, ?, ?)`,
            [participant.id_conversation, participant.id_user,
                participant.nickname,
                integerToTimestamp(participant.timestamp)]);
    }

    /**
     * Delete participant from temporary table
     * @param participant
     */
    private deleteTemp(participant: Participant): Promise<any> {
        return DatabaseService.db.executeSql(
            'delete from participant_temp where id_conversation = ? and' +
            'id_user = ?',
            [participant.id_conversation, participant.id_user]);
    }

    /**
     * Save a participant that has been saved to the server
     * @param participant
     */
    save(participant: Participant): Promise<any> {
        return this.deleteTemp(participant)
            .then(_ => this.set(participant, true));
    }
}
