import classNames from 'classnames'

export default function Footer({ className }) {
  return (
    <footer className={classNames('footer', className)}>
      <div className="content has-text-centered">
        <p>
          <strong>
            <a href="https://mgmarlow.com">mgmarlow.com</a>
          </strong>{' '}
          by Graham Marlow.
        </p>
        <p>
          If you'd like to support my writing, consider{' '}
          <a href="https://www.buymeacoffee.com/mgmarlow">buying me a coffee</a>
          .
        </p>
      </div>

      {/* <div className="columns is-centered">
        <div className="column is-narrow has-text-centered">
          <a href="https://www.buymeacoffee.com/mgmarlow" target="_blank">
            <img
              src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
              alt="Buy Me A Coffee"
              style={{ height: '60px', width: '217px' }}
            />
          </a>
        </div>
      </div> */}
    </footer>
  )
}
