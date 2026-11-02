import { asistenciaregistrada } from '../../../../core/application/eventos/asistenciaregistrada.event';
import { buseventosaplicacionenmemoria } from '../../../../core/infrastructure/nest/buseventosenmemoria';
import { casousoevaluaralertasestudiante } from '../../application/use-cases/alerta.use-cases';
import { suscriptorasistenciaregistradaalerta } from './suscriptoralertaasistenciaregistrada';

describe('AttendanceRegisteredAlertSubscriber', () => {
  it('asks the monitoring use case to reevaluate the registered student', async () => {
    const eventobus = new buseventosaplicacionenmemoria();
    const casoevaluaralertasestudiante = {
      ejecutarsiesposible: jest.fn().mockResolvedValue(undefined),
    } as unknown as casousoevaluaralertasestudiante;
    const subscriber = new suscriptorasistenciaregistradaalerta(
      eventobus,
      casoevaluaralertasestudiante,
    );
    const evento: asistenciaregistrada = {
      type: 'attendance.registered',
      attendanceId: 'attendance-1',
      studentId: 'student-1',
      courseId: 'course-1',
      date: '2026-03-04T00:00:00.000Z',
      status: 'PRESENT',
    };

    subscriber.onModuleInit();
    await eventobus.publicar(evento);

    expect(casoevaluaralertasestudiante.ejecutarsiesposible).toHaveBeenCalledWith('student-1');
  });
});
