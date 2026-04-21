import { describe, it, expect, beforeEach } from 'vitest';
import { callStore, callActions, CallStatus, Participant } from './callStore';

describe('callStore', () => {
  beforeEach(() => {
    callActions.reset();
  });

  it('should initialize with default values', () => {
    expect(callStore.status).toBe('idle');
    expect(callStore.participants).toEqual([]);
    expect(callStore.error).toBeNull();
  });

  it('should update status', () => {
    callActions.setStatus('dialing');
    expect(callStore.status).toBe('dialing');
    callActions.setStatus('connected');
    expect(callStore.status).toBe('connected');
  });

  it('should manage participants', () => {
    const participant: Participant = {
      id: '1',
      nick: 'User 1',
      mic: true,
      camera: true,
    };

    callActions.addParticipant(participant);
    expect(callStore.participants).toContainEqual(participant);
    expect(callStore.participants.length).toBe(1);

    callActions.addParticipant(participant); // duplicate
    expect(callStore.participants.length).toBe(1);

    callActions.updateParticipant('1', { nick: 'Updated User 1', mic: false });
    expect(callStore.participants[0].nick).toBe('Updated User 1');
    expect(callStore.participants[0].mic).toBe(false);

    callActions.removeParticipant('1');
    expect(callStore.participants.length).toBe(0);
  });

  it('should handle errors', () => {
    callActions.setError('Connection failed');
    expect(callStore.error).toBe('Connection failed');
  });

  it('should reset state', () => {
    callActions.setStatus('connected');
    callActions.addParticipant({ id: '1', nick: 'U1', mic: true, camera: true });
    callActions.reset();
    expect(callStore.status).toBe('idle');
    expect(callStore.participants).toEqual([]);
  });
});
