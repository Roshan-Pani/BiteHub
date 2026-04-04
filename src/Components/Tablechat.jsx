import React from 'react'

// Visual seat map component similar to cinema or airline booking.
// Shows seats grouped by type (Booth, Standard Table, etc.) as clickable boxes.
// Each box represents one individual seat/chair.
function Tablechat({ tableUnits, selectedTableIds, onToggleTable, requiredSeats = 1 }) {
  // Group seats by type
  const groupedByType = tableUnits.reduce((acc, seat) => {
    if (!acc[seat.type]) acc[seat.type] = []
    acc[seat.type].push(seat)
    return acc
  }, {})

  // Count selected seats and calculate availability
  const selectedCount = selectedTableIds.length
  const availableSeats = tableUnits.filter((s) => s.status === 'Available').length
  const reservedSeats = tableUnits.filter((s) => s.status === 'Reserved').length

  const typeKeys = Object.keys(groupedByType).sort((a, b) => a.localeCompare(b))
  const progress = Math.min(100, Math.round((selectedCount / Math.max(1, requiredSeats)) * 100))
  const hasEnoughSeats = selectedCount >= requiredSeats

  if (typeKeys.length === 0) {
    return (
      <div className="surface-panel">
        <h3 className="text-lg font-bold text-black mb-2">Tablechat - Seat Selection</h3>
        <p className="text-sm text-black/70">No seats available for this restaurant.</p>
      </div>
    )
  }

  return (
    <div className="surface-panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-black">Tablechat - Seat Selection</h3>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-semibold ${hasEnoughSeats ? 'text-green-700' : 'text-black/70'}`}>
            Seats: {selectedCount}/{requiredSeats}
          </span>
          {selectedCount > 0 && (
            <button
              type="button"
              onClick={() => onToggleTable(null)} // Signals reset (will be handled by parent)
              className="text-xs font-semibold px-3 py-1 rounded-lg border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
              title="Clear all selected seats"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-black/70 mb-4">
        Click individual seats to select. Each seat represents one chair. Green = available, Red = reserved.
      </p>

      {/* Seat selection progress bar */}
      <div className="mb-5 border border-brand-200 rounded-xl p-3 bg-brand-50/10">
        <div className="flex items-center justify-between text-xs font-semibold text-black/70 mb-2">
          <span>Selection Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-brand-100/30 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${hasEnoughSeats ? 'bg-green-600' : 'bg-accent-600'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-black/70">Available: {availableSeats}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-black/70">Reserved: {reservedSeats}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-600" />
            <span className="text-black/70">Selected: {selectedCount}</span>
          </div>
        </div>
      </div>

      {/* Seat map by type */}
      <div className="space-y-6">
        {typeKeys.map((type) => {
          const seats = groupedByType[type]
          const typeSeatCount = seats.length
          const typeReserved = seats.filter((s) => s.status !== 'Available').length
          const typeAvailable = typeSeatCount - typeReserved

          return (
            <section key={type} className="border-t border-brand-200 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold uppercase tracking-wide text-black">{type}</h4>
                <span className="text-xs font-semibold text-black/60">
                  {typeAvailable}/{typeSeatCount} available
                </span>
              </div>

              {/* Seat grid */}
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {seats.map((seat) => {
                  const isSelected = selectedTableIds.includes(seat.id)
                  const isAvailable = seat.status === 'Available'

                  let seatButtonClass = 'bg-white border-2 border-green-400 text-green-700 hover:border-accent-600 hover:bg-green-50'
                  if (!isAvailable) {
                    seatButtonClass = 'bg-red-50 border-2 border-red-400 text-red-700 cursor-not-allowed'
                  }
                  if (isSelected) {
                    seatButtonClass = 'bg-accent-100 border-2 border-accent-600 text-accent-900 shadow-md font-bold'
                  }

                  // Extract seat number from id (last part)
                  const seatLabel = seat.id.split('-').pop()

                  return (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => isAvailable && onToggleTable(seat.id)}
                      disabled={!isAvailable}
                      className={`rounded-lg border p-2 transition-all text-center text-xs font-bold ${seatButtonClass}`}
                      title={`${seat.type} - Seat ${seatLabel} (${seat.status})`}
                    >
                      <div className="flex flex-col items-center justify-center gap-1">
                        <div className={`w-4 h-4 rounded-full ${isSelected ? 'bg-accent-600' : isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-[10px] leading-tight">{seatLabel}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-700">
          💡 <strong>Tip:</strong> Click seats to select them. Your selected seats appear with a bold accent color. You need to select enough seats for your guest count.
        </p>
      </div>
    </div>
  )
}

export default Tablechat
