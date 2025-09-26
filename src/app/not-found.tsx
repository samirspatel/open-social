import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-instagram-background flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-8xl font-bold bg-gradient-to-r from-instagram-primary via-instagram-secondary to-instagram-tertiary bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-instagram-text mb-4">Page Not Found</h1>
        <p className="text-instagram-text-light mb-8 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist in the distributed social network.
        </p>
        <Link 
          href="/"
          className="btn-instagram inline-flex items-center"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
