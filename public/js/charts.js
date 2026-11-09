/* ============================================================
   Gráficos Chart.js — Lowry chicken protein
   ============================================================ */

(function () {
  // Aguarda o DOM estar pronto e o Chart.js carregado (defer)
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js não carregou. Os gráficos não serão desenhados.');
      return;
    }

    // Paleta de cores reutilizada
    const CORES = {
      azul:      '#1d4ed8',
      azulClaro: 'rgba(29, 78, 216, 0.15)',
      vermelho:  '#dc2626',
      amarelo:   '#d97706',
      verde:     '#059669',
      cinza:     '#64748b',
    };

    // Configuração global
    Chart.defaults.font.family = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#475569';

    // ---------- Helper: recta de calibrado ----------
    function crearGraficoRecta(canvasId, sesion, cor) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;

      const { patroes, recta } = sesion;

      // Pontos dos padrões (sem o branco)
      const puntos = patroes
        .filter(p => p.mgProteina > 0)
        .map(p => ({ x: p.mgProteina, y: p.absorbancia }));

      // Recta calculada a partir da pendente e ordenada
      const xMax = Math.max(...puntos.map(p => p.x));
      const linea = [
        { x: 0, y: recta.ordenada },
        { x: xMax, y: recta.pendente * xMax + recta.ordenada }
      ];

      new Chart(canvas, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Padróns',
              data: puntos,
              backgroundColor: cor,
              borderColor: cor,
              pointRadius: 6,
              pointHoverRadius: 8,
            },
            {
              label: 'Axuste lineal',
              data: linea,
              type: 'line',
              borderColor: cor,
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointRadius: 0,
              fill: false,
              tension: 0,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: (${ctx.parsed.x.toFixed(2)} mg, ${ctx.parsed.y.toFixed(3)})`
              }
            },
            title: {
              display: true,
              text: `${recta.ecuacion}   (R² = ${recta.r2})`,
              font: { size: 13, weight: '600' },
              color: '#0f172a'
            }
          },
          scales: {
            x: {
              title: { display: true, text: 'Cantidade de proteína (mg por 0,1 mL)' },
              beginAtZero: true,
            },
            y: {
              title: { display: true, text: 'Absorbancia' },
              beginAtZero: true,
            }
          }
        }
      });
    }

    // ---------- Gráfico de barras (mg / 100 mg) ----------
    function crearGraficoBarras(canvasId, resultados) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;

      const nomes  = resultados.tecidos.map(t => t.nome);
      const medias = resultados.tecidos.map(t => t.mediaMgPor100mg);
      const desvios = resultados.tecidos.map(t => t.desvio);
      const cores = [CORES.azul, CORES.amarelo, CORES.vermelho];

      new Chart(canvas, {
        type: 'bar',
        data: {
          labels: nomes,
          datasets: [{
            label: 'mg proteína / 100 mg tecido',
            data: medias,
            backgroundColor: cores.map(c => c + 'cc'), // cc = 80% opacidade
            borderColor: cores,
            borderWidth: 1.5,
            borderRadius: 6,
            // Barras de erro (usando o plugin nativo do Chart.js 4)
            errorBars: desvios,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const i = ctx.dataIndex;
                  return [
                    `Media: ${medias[i]} mg / 100 mg`,
                    `Desvío típico: ± ${desvios[i]}`
                  ];
                }
              }
            }
          },
          scales: {
            y: {
              title: { display: true, text: 'mg proteína / 100 mg tecido' },
              beginAtZero: true,
              suggestedMax: 7
            }
          }
        }
      });
    }

    // ---------- Inicialização ----------
    const dados = window.__dados || {};

    if (dados.patroes) {
      crearGraficoRecta('graficoRecta1', dados.patroes.sesion1, CORES.azul);
      crearGraficoRecta('graficoRecta2', dados.patroes.sesion2, CORES.vermelho);
    }

    if (dados.resultados) {
      crearGraficoBarras('graficoBarras', dados.resultados);
    }
  });
})();