import { useScrollProgress } from '../hooks/useScrollProgress'

const steps = [
  {
    title: 'Собери объект в Blender',
    text: 'Один герой-меш, простой материал, HDRI-свет. Экспорт в .glb без лишней геометрии.',
  },
  {
    title: 'Положи файл в проект',
    text: 'Сохрани модель как public/models/hero.glb — сцена подхватит её автоматически вместо плейсхолдера.',
  },
  {
    title: 'Привяжи движение к скроллу',
    text: 'Камера и вращение уже завязаны на progress. Дальше крути easing, свет и timing под бренд.',
  },
]

export function Overlay() {
  const { progress } = useScrollProgress()

  return (
    <div className="overlay">
      <header className="topbar">
        <a className="brand" href="#top">
          Castomka
        </a>
        <nav className="nav">
          <a href="#pipeline">Пайплайн</a>
          <a href="#drop">GLB</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="top">
          <p className="eyebrow">Motion / 3D scaffold</p>
          <h1 className="brand-hero">Castomka</h1>
          <p className="lead">
            Каркас под проф. моушен-сцены: React Three Fiber, scroll-камера и слот под blender-объекты.
          </p>
          <div className="cta-row">
            <a className="cta primary" href="#drop">
              Добавить свой GLB
            </a>
            <a className="cta ghost" href="#pipeline">
              Смотреть шаги
            </a>
          </div>
          <p className="scroll-hint">
            Скролль — сцена крутится
            <span className="progress" style={{ width: `${Math.max(8, progress * 100)}%` }} />
          </p>
        </section>

        <section className="section" id="pipeline">
          <h2>Как дойти до рабочей сцены</h2>
          <p className="section-lead">Три коротких шага от Blender до продакшен-лендинга.</p>
          <ol className="steps">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className="step-index">0{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="section drop" id="drop">
          <h2>Слот под твой объект</h2>
          <p className="section-lead">
            Пока файла нет — крутится procedural placeholder. Как только появится{' '}
            <code>public/models/hero.glb</code>, он заменит плейсхолдер.
          </p>
          <pre className="code-block">{`# В Blender
File → Export → glTF 2.0 (.glb)
☑ Selected Objects
☑ Apply Modifiers
☐ +Y Up → оставь стандарт
сжимай текстуры до 1K

# В проекте
public/models/hero.glb`}</pre>
        </section>

        <section className="section finale">
          <h2>Дальше усиливай motion</h2>
          <p className="section-lead">
            Добавь второй объект, смену света по секциям, mobile fallback на WebM и loading-состояние.
          </p>
        </section>
      </main>

      <footer className="footer">
        <span>Castomka</span>
        <span>R3F · Drei · scroll-driven camera</span>
      </footer>
    </div>
  )
}
