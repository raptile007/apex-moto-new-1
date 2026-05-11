'use client'

import * as React from 'react'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant']
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'glass-dark group/calendar p-4 rounded-2xl border border-white/5 shadow-2xl [--cell-size:36px] md:[--cell-size:42px]',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn(
          'flex gap-6 flex-col md:flex-row relative',
          defaultClassNames.months,
        ),
        month: cn('flex flex-col w-full gap-4', defaultClassNames.month),
        nav: cn(
          'flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between z-10',
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-8 bg-white/5 border border-white/10 hover:bg-apex-orange/20 hover:text-apex-orange hover:border-apex-orange/30 aria-disabled:opacity-50 p-0 select-none transition-all rounded-lg',
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-8 bg-white/5 border border-white/10 hover:bg-apex-orange/20 hover:text-apex-orange hover:border-apex-orange/30 aria-disabled:opacity-50 p-0 select-none transition-all rounded-lg',
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          'flex items-center justify-center h-10 w-full px-10 mb-2',
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          'w-full flex items-center text-[10px] font-black uppercase tracking-widest justify-center h-10 gap-2',
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          'relative has-focus:border-apex-orange/50 border border-white/10 bg-white/5 shadow-xs rounded-xl overflow-hidden',
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn(
          'absolute bg-black inset-0 opacity-0 cursor-pointer',
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          'select-none font-display font-bold uppercase tracking-widest text-xs text-white italic',
          captionLayout === 'label'
            ? ''
            : 'rounded-md pl-2 pr-1 flex items-center gap-1 h-8 [&>svg]:text-apex-orange [&>svg]:size-3.5',
          defaultClassNames.caption_label,
        ),
        table: 'w-full border-separate border-spacing-y-1',
        weekdays: cn('flex mb-2', defaultClassNames.weekdays),
        weekday: cn(
          'text-neutral-500 rounded-md flex-1 font-black text-[9px] uppercase tracking-tighter select-none',
          defaultClassNames.weekday,
        ),
        week: cn('flex w-full', defaultClassNames.week),
        week_number_header: cn(
          'select-none w-(--cell-size)',
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          'text-[0.8rem] select-none text-muted-foreground',
          defaultClassNames.week_number,
        ),
        day: cn(
          'relative w-full h-full p-0 text-center group/day aspect-square select-none',
          defaultClassNames.day,
        ),
        range_start: cn(
          'rounded-l-xl bg-apex-orange/20',
          defaultClassNames.range_start,
        ),
        range_middle: cn('rounded-none bg-apex-orange/10', defaultClassNames.range_middle),
        range_end: cn('rounded-r-xl bg-apex-orange/20', defaultClassNames.range_end),
        today: cn(
          'relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-apex-orange after:rounded-full',
          defaultClassNames.today,
        ),
        outside: cn(
          'text-neutral-700 opacity-40 aria-selected:text-neutral-500',
          defaultClassNames.outside,
        ),
        disabled: cn(
          'text-neutral-800 opacity-20',
          defaultClassNames.disabled,
        ),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return (
              <ChevronLeftIcon className={cn('size-4', className)} {...props} />
            )
          }

          if (orientation === 'right') {
            return (
              <ChevronRightIcon
                className={cn('size-4', className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn('size-4', className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        'relative transition-all duration-300',
        'text-white text-[10px] font-bold tracking-tighter',
        'hover:bg-white/10 hover:scale-110',
        'data-[selected-single=true]:bg-apex-orange data-[selected-single=true]:text-white data-[selected-single=true]:shadow-[0_0_15px_rgba(255,77,0,0.5)] data-[selected-single=true]:rounded-xl',
        'data-[range-start=true]:bg-apex-orange data-[range-start=true]:text-white data-[range-start=true]:rounded-l-xl data-[range-start=true]:shadow-[0_0_15px_rgba(255,77,0,0.3)]',
        'data-[range-end=true]:bg-apex-orange data-[range-end=true]:text-white data-[range-end=true]:rounded-r-xl data-[range-end=true]:shadow-[0_0_15px_rgba(255,77,0,0.3)]',
        'data-[range-middle=true]:bg-apex-orange/15 data-[range-middle=true]:text-apex-orange data-[range-middle=true]:rounded-none',
        'group-data-[focused=true]/day:ring-1 group-data-[focused=true]/day:ring-apex-orange/50',
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
