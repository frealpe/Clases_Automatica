import React from 'react';
import { EvaluacionQuicesViewBase } from './EvaluacionQuicesView';
import { withAuth } from '../hocs/withAuth';
import { withRole } from '../hocs/withRole';

function ExamenesCalendarioViewBase() {
  return <EvaluacionQuicesViewBase defaultTab="calendario" />;
}

export default withAuth(withRole(ExamenesCalendarioViewBase, ['DOCENTE', 'SUPERUSUARIO']));

