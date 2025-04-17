export function calculateAge(birthDate: string) {
  const yearInMs = 3.15576e10
  return Math.floor(
    (new Date().getTime() - new Date(birthDate).getTime()) / yearInMs
  )
}
