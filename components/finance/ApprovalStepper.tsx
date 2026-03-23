import { Check, X, Clock } from 'lucide-react'

export interface ApprovalStep {
  label: string
  status: 'done' | 'active' | 'pending' | 'rejected'
  date?: string
  actorName?: string
}

interface ApprovalStepperProps {
  steps: ApprovalStep[]
}

/**
 * ApprovalStepper Component
 *
 * Horizontal step tracker showing document approval progress
 * Used across all finance document types (Memo, PV, Advance)
 */
export function ApprovalStepper({ steps }: ApprovalStepperProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" aria-hidden="true">
          {/* Completed portion of the line */}
          <div
            className="h-full bg-green-600 transition-all duration-300"
            style={{
              width: `${(steps.filter((s) => s.status === 'done').length / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1

            return (
              <div key={index} className="flex flex-col items-center" style={{ width: `${100 / steps.length}%` }}>
                {/* Step circle */}
                <div className="relative z-10 flex items-center justify-center">
                  {step.status === 'done' && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white">
                      <Check className="h-5 w-5" />
                    </div>
                  )}
                  {step.status === 'active' && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white animate-pulse">
                      <Clock className="h-5 w-5" />
                    </div>
                  )}
                  {step.status === 'pending' && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                      <div className="h-3 w-3 rounded-full bg-gray-300" />
                    </div>
                  )}
                  {step.status === 'rejected' && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white">
                      <X className="h-5 w-5" />
                    </div>
                  )}
                </div>

                {/* Step label and details */}
                <div className="mt-3 text-center">
                  <p
                    className={`text-sm font-medium ${
                      step.status === 'done'
                        ? 'text-green-700'
                        : step.status === 'active'
                        ? 'text-blue-700'
                        : step.status === 'rejected'
                        ? 'text-red-700'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.actorName && (
                    <p className="text-xs text-gray-500 mt-1">{step.actorName}</p>
                  )}
                  {step.date && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(step.date).toLocaleDateString('en-NG', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
