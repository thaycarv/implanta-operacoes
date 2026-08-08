import type { ImplementationProject } from '../types'

interface ProjectPickerProps {
  projects: ImplementationProject[]
  value: string
  onChange: (projectId: string) => void
}

export function ProjectPicker({ projects, value, onChange }: ProjectPickerProps) {
  return (
    <label className="project-picker">
      Implantação
      <select value={value} onChange={event => onChange(event.target.value)}>
        {projects.map(project => (
          <option value={project.id} key={project.id}>
            {project.profile.clientName}
          </option>
        ))}
      </select>
    </label>
  )
}
