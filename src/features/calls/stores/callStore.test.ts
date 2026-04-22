import { describe, it, expect, beforeEach } from 'vitest';
import { callStore, callActions } from './callStore';
import type { Participant } from './callStore';

describe('callStore', () => {
  beforeEach(() => {
    callActions.reset();
  });

  it('should add a participant', () => {
    const participant: Participant = { id: 'user1', nick: 'Test User', mic: true, camera: true };
    callActions.addParticipant(participant);
    expect(callStore.participants).toHaveLength(1);
    expect(callStore.participants[0]).toEqual(participant);
  });

  it('should not add duplicate participants', () => {
    const participant: Participant = { id: 'user1', nick: 'Test User', mic: true, camera: true };
    callActions.addParticipant(participant);
    callActions.addParticipant(participant);
    expect(callStore.participants).toHaveLength(1);
  });

  it('should remove a participant', () => {
    callActions.addParticipant({ id: 'user1', nick: 'User 1', mic: true, camera: true });
    callActions.addParticipant({ id: 'user2', nick: 'User 2', mic: true, camera: true });
    callActions.removeParticipant('user1');
    expect(callStore.participants).toHaveLength(1);
    expect(callStore.participants[0].id).toBe('user2');
  });

  it('should update status', () => {
    callActions.setStatus('connected');
    expect(callStore.status).toBe('connected');
  });
});
