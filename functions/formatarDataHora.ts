export function formatarDataEHorario(data: string, horario: string): String {
    // Converter data para formato dd/mm/aaaa
    const [ano, mes, dia] = data.split("-");
    const dataFormatada = `${dia}/${mes}/${ano}`;
  
    // Extrair apenas as horas e minutos do horário
    const [hora, minuto] = horario.split(":");
    const horarioFormatado = `${hora}:${minuto}`;
  
    return `${dataFormatada} às ${horarioFormatado}`;
  }

  