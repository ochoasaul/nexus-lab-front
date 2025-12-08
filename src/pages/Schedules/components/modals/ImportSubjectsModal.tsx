import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { subjectService } from '@/services/subjectService'
import { useToastStore } from '@/store/toastStore'

interface ImportSubjectsModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function ImportSubjectsModal({ isOpen, onClose, onSuccess }: ImportSubjectsModalProps) {
    const [file, setFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [previewData, setPreviewData] = useState<any[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const addToast = useToastStore((state) => state.addToast)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return

        setFile(selectedFile)
        setIsLoading(true)

        try {
            const data = await parseExcel(selectedFile)
            setPreviewData(data)
        } catch (error) {
            console.error('Error parsing file:', error)
            addToast('Error al leer el archivo Excel', 'error')
            setFile(null)
            setPreviewData([])
            if (fileInputRef.current) fileInputRef.current.value = ''
        } finally {
            setIsLoading(false)
        }
    }

    const parseExcel = (file: File): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const data = e.target?.result
                    const workbook = XLSX.read(data, { type: 'binary' })
                    const sheetName = workbook.SheetNames[0]
                    const sheet = workbook.Sheets[sheetName]
                    const jsonData = XLSX.utils.sheet_to_json(sheet)
                    resolve(jsonData)
                } catch (error) {
                    reject(error)
                }
            }
            reader.onerror = (error) => reject(error)
            reader.readAsBinaryString(file)
        })
    }

    const handleImport = async () => {
        if (!previewData.length) return

        setIsLoading(true)
        try {
            const result = await subjectService.importAssignments(previewData)

            let message = `Importación completada: ${result.created} creados.`
            if (result.errors && result.errors.length > 0) {
                message += ` ${result.errors.length} errores.`
            }
            if (result.incompleteTeachers && result.incompleteTeachers.length > 0) {
                message += ` ${result.incompleteTeachers.length} docentes con datos incompletos.`
            }

            addToast(message, result.errors?.length ? 'warning' : 'success')
            onSuccess()
            handleClose()
        } catch (error: any) {
            console.error('Error importing data:', error)
            addToast(error.message || 'Error al importar datos', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setFile(null)
        setPreviewData([])
        if (fileInputRef.current) fileInputRef.current.value = ''
        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Importar Materias desde Excel"
            size="lg"
        >
            <div className="space-y-6">
                <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
                    <p className="font-medium mb-1">Formato requerido:</p>
                    <p>El archivo Excel debe contener las siguientes columnas:</p>
                    <ul className="list-disc list-inside mt-1 ml-2">
                        <li>Materia</li>
                        <li>Horario</li>
                        <li>Modalidad</li>
                        <li>Docente (Apellido, Nombre)</li>
                        <li>Lab. (Aula)</li>
                    </ul>
                </div>

                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-charcoal-200 p-8 transition-colors hover:border-primary-400 hover:bg-primary-50">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        className="hidden"
                        id="excel-upload"
                    />
                    <label
                        htmlFor="excel-upload"
                        className="flex cursor-pointer flex-col items-center gap-2"
                    >
                        <div className="rounded-full bg-primary-100 p-3 text-primary-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="12" y1="18" x2="12" y2="12"></line>
                                <line x1="9" y1="15" x2="15" y2="15"></line>
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-charcoal-900">
                            {file ? file.name : 'Haz clic para seleccionar un archivo'}
                        </span>
                        <span className="text-xs text-charcoal-500">
                            Soporta archivos .xlsx y .xls
                        </span>
                    </label>
                </div>

                {previewData.length > 0 && (
                    <div className="rounded-lg border border-charcoal-200 bg-charcoal-50 p-4">
                        <p className="text-sm font-medium text-charcoal-900 mb-2">
                            Vista previa ({previewData.length} registros):
                        </p>
                        <div className="max-h-40 overflow-y-auto text-xs text-charcoal-600">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-charcoal-200">
                                        <th className="py-1">Materia</th>
                                        <th className="py-1">Docente</th>
                                        <th className="py-1">Horario</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.slice(0, 5).map((row, i) => (
                                        <tr key={i} className="border-b border-charcoal-100 last:border-0">
                                            <td className="py-1">{row['Materia']}</td>
                                            <td className="py-1">{row['Docente']}</td>
                                            <td className="py-1">{row['Horario']}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {previewData.length > 5 && (
                                <p className="mt-2 text-center italic text-charcoal-400">
                                    ... y {previewData.length - 5} más
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-charcoal-100">
                    <Button
                        variant="ghost"
                        label="Cancelar"
                        onClick={handleClose}
                    />
                    <Button
                        variant="primary"
                        label={isLoading ? 'Importando...' : 'Importar'}
                        onClick={handleImport}
                        disabled={!file || isLoading || previewData.length === 0}
                    />
                </div>
            </div>
        </Modal>
    )
}
