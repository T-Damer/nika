import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { AlertCircle, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
      <h1 className="text-4xl font-bold gradient-text mb-8">mene</h1>
      <Card className="w-full max-w-md mx-4 shadow-lg border">
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <div className="rounded-full bg-primary bg-opacity-10 p-3 mb-4">
            <AlertCircle className="h-8 w-8 text-brand-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t('errors.notFound.title', '404 Page Not Found')}
          </h1>
          <p className="text-muted-foreground">
            {t(
              'errors.notFound.message',
              'Sorry, the page you are looking for does not exist or has been moved.'
            )}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <Button
            asChild
            className="brand-gradient text-white hover:opacity-90 transition-opacity gap-2"
          >
            <Link to="/">
              <Home className="h-4 w-4" />
              {t('common.backToHome', 'Back to Home')}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
