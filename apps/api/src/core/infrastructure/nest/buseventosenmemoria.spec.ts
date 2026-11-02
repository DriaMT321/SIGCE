import { attendanceregistered } from '@academic/shared-types';
import { buseventosaplicacionenmemoria } from './buseventosenmemoria';

describe('InMemoryApplicationEventBus', () => {
  const evento: attendanceregistered = {
    type: 'attendance.registered',
    attendanceId: 'attendance-1',
    studentId: 'student-1',
    courseId: 'course-1',
    date: '2026-03-04T00:00:00.000Z',
    status: 'PRESENT',
  };

  it('dispatches an event to matching subscribers and waits for their work', async () => {
    const bus = new buseventosaplicacionenmemoria();
    const manejador = jest.fn().mockResolvedValue(undefined);
    bus.suscribir<attendanceregistered>('attendance.registered', manejador);

    await bus.publicar(evento);

    expect(manejador).toHaveBeenCalledWith(evento);
  });

  it('stops dispatching after a subscriber is removed', async () => {
    const bus = new buseventosaplicacionenmemoria();
    const manejador = jest.fn().mockResolvedValue(undefined);
    const unsubscribe = bus.suscribir<attendanceregistered>('attendance.registered', manejador);
    unsubscribe();

    await bus.publicar(evento);

    expect(manejador).not.toHaveBeenCalled();
  });
});
