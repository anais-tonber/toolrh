import React, { useState, useMemo } from 'react';
import { Users, TrendingUp, BarChart3, Target, Plus, Download, Upload, Edit2, Trash2 } from 'lucide-react';

// Interfaces pour les types de données
interface ExchangeRates {
  EUR: number;
  USD: number;
  GBP: number;
  BRL: number;
}

interface SalaryRange {
  min: number;
  max: number;
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  level: 'Junior' | 'Intermédiaire' | 'Senior';
  salary: number;
  bonus: number;
  type: 'CDI' | 'Service Provider';
  startDate: string;
  department: string;
  currency: keyof ExchangeRates;
  history: Array<{
    date: string;
    salary: number;
    bonus: number;
    reason: string;
  }>;
}

interface Position {
  id: number;
  name: string;
  department: string;
  description: string;
  skills: string[];
  objectives: string;
  salaryRanges: {
    Junior: SalaryRange;
    Intermédiaire: SalaryRange;
    Senior: SalaryRange;
  };
}

interface AnalysisData {
  [key: string]: {
    position: string;
    level: string;
    employees: Employee[];
    salaries: number[];
    min: number;
    max: number;
    median: number;
    average: number;
    count: number;
    range: SalaryRange | null;
  };
}

interface BenchmarkData {
  [position: string]: {
    france: { junior: number; intermédiaire: number; senior: number };
    international: { junior: number; intermédiaire: number; senior: number };
    market: { junior: number; intermédiaire: number; senior: number };
  };
}

// Données initiales
const initialEmployees: Employee[] = [
  {
    id: 1,
    firstName: 'Marie',
    lastName: 'Dupont',
    position: 'Développeur Frontend',
    level: 'Senior',
    salary: 65000,
    bonus: 5000,
    type: 'CDI',
    startDate: '2021-03-15',
    department: 'Tech',
    currency: 'EUR',
    history: [
      { date: '2021-03-15', salary: 55000, bonus: 3000, reason: 'Embauche' },
      { date: '2022-03-15', salary: 60000, bonus: 4000, reason: 'Augmentation annuelle' },
      { date: '2023-03-15', salary: 65000, bonus: 5000, reason: 'Promotion Senior' }
    ]
  },
  {
    id: 2,
    firstName: 'Pierre',
    lastName: 'Martin',
    position: 'Développeur Backend',
    level: 'Intermédiaire',
    salary: 52000,
    bonus: 3000,
    type: 'CDI',
    startDate: '2022-01-10',
    department: 'Tech',
    currency: 'EUR',
    history: [
      { date: '2022-01-10', salary: 48000, bonus: 2000, reason: 'Embauche' },
      { date: '2023-01-10', salary: 52000, bonus: 3000, reason: 'Augmentation annuelle' }
    ]
  },
  {
    id: 3,
    firstName: 'Sophie',
    lastName: 'Bernard',
    position: 'Product Manager',
    level: 'Senior',
    salary: 75000,
    bonus: 8000,
    type: 'CDI',
    startDate: '2020-06-01',
    department: 'Product',
    currency: 'EUR',
    history: [
      { date: '2020-06-01', salary: 65000, bonus: 5000, reason: 'Embauche' },
      { date: '2021-06-01', salary: 70000, bonus: 6000, reason: 'Augmentation annuelle' },
      { date: '2022-06-01', salary: 75000, bonus: 8000, reason: 'Promotion Senior' }
    ]
  },
  {
    id: 4,
    firstName: 'Thomas',
    lastName: 'Leroy',
    position: 'Designer UX/UI',
    level: 'Junior',
    salary: 42000,
    bonus: 2000,
    type: 'Service Provider',
    startDate: '2023-09-01',
    department: 'Design',
    currency: 'EUR',
    history: [
      { date: '2023-09-01', salary: 42000, bonus: 2000, reason: 'Embauche' }
    ]
  },
  {
    id: 5,
    firstName: 'Laura',
    lastName: 'Rousseau',
    position: 'Data Scientist',
    level: 'Intermédiaire',
    salary: 58000,
    bonus: 4000,
    type: 'CDI',
    startDate: '2021-11-15',
    department: 'Data',
    currency: 'EUR',
    history: [
      { date: '2021-11-15', salary: 50000, bonus: 3000, reason: 'Embauche' },
      { date: '2022-11-15', salary: 58000, bonus: 4000, reason: 'Augmentation annuelle' }
    ]
  }
];

const initialPositions: Position[] = [
  {
    id: 1,
    name: 'Développeur Frontend',
    department: 'Tech',
    description: 'Développement d\'interfaces utilisateur modernes et responsives',
    skills: ['React', 'TypeScript', 'CSS', 'JavaScript', 'HTML'],
    objectives: 'Créer des expériences utilisateur exceptionnelles',
    salaryRanges: {
      Junior: { min: 35000, max: 45000 },
      Intermédiaire: { min: 45000, max: 60000 },
      Senior: { min: 60000, max: 80000 }
    }
  },
  {
    id: 2,
    name: 'Développeur Backend',
    department: 'Tech',
    description: 'Développement d\'APIs et architecture serveur',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS'],
    objectives: 'Assurer la robustesse et la scalabilité des systèmes',
    salaryRanges: {
      Junior: { min: 38000, max: 48000 },
      Intermédiaire: { min: 48000, max: 65000 },
      Senior: { min: 65000, max: 85000 }
    }
  },
  {
    id: 3,
    name: 'Product Manager',
    department: 'Product',
    description: 'Gestion de produit et roadmap stratégique',
    skills: ['Product Strategy', 'Analytics', 'Agile', 'User Research'],
    objectives: 'Maximiser la valeur produit et satisfaction utilisateur',
    salaryRanges: {
      Junior: { min: 45000, max: 55000 },
      Intermédiaire: { min: 55000, max: 75000 },
      Senior: { min: 75000, max: 95000 }
    }
  },
  {
    id: 4,
    name: 'Designer UX/UI',
    department: 'Design',
    description: 'Conception d\'expériences utilisateur et interfaces',
    skills: ['Figma', 'Sketch', 'User Research', 'Prototyping'],
    objectives: 'Créer des designs centrés utilisateur',
    salaryRanges: {
      Junior: { min: 35000, max: 45000 },
      Intermédiaire: { min: 45000, max: 60000 },
      Senior: { min: 60000, max: 75000 }
    }
  },
  {
    id: 5,
    name: 'Data Scientist',
    department: 'Data',
    description: 'Analyse de données et machine learning',
    skills: ['Python', 'SQL', 'Machine Learning', 'Statistics'],
    objectives: 'Extraire des insights business des données',
    salaryRanges: {
      Junior: { min: 40000, max: 50000 },
      Intermédiaire: { min: 50000, max: 70000 },
      Senior: { min: 70000, max: 90000 }
    }
  }
];

const levels = ['Junior', 'Intermédiaire', 'Senior'] as const;
const currencies = ['EUR', 'USD', 'GBP', 'BRL'] as const;
const exchangeRates: ExchangeRates = { EUR: 1, USD: 0.92, GBP: 1.18, BRL: 0.18 };

// Interfaces pour les props des composants
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface BoxPlotChartProps {
  data: AnalysisData;
  title: string;
}

interface EmployeeFormProps {
  employee?: Employee | null;
  onSave: (employee: Employee) => void;
  onClose: () => void;
}

interface PositionFormProps {
  onSave: (position: Position) => void;
  onClose: () => void;
}

interface Filters {
  type: string;
  position: string;
  department: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('employees');
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [positions, setPositions] = useState<Position[]>(initialPositions);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [showAddEmployee, setShowAddEmployee] = useState<boolean>(false);
  const [showAddPosition, setShowAddPosition] = useState<boolean>(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [filters, setFilters] = useState<Filters>({ type: '', position: '', department: '' });
  const [globalCurrency, setGlobalCurrency] = useState<keyof ExchangeRates>('EUR');

  // Conversion de devise
  const convertCurrency = (amount: number, fromCurrency: keyof ExchangeRates, toCurrency: keyof ExchangeRates): number => {
    if (fromCurrency === toCurrency) return amount;
    const euroAmount = amount / exchangeRates[fromCurrency];
    return Math.round(euroAmount * exchangeRates[toCurrency]);
  };

  // Calcul de l'ancienneté
  const calculateSeniority = (startDate: string): string => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    return `${years}a ${months}m`;
  };

  // Employés filtrés
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      return (filters.type === '' || emp.type === filters.type) &&
             (filters.position === '' || emp.position === filters.position) &&
             (filters.department === '' || positions.find(p => p.name === emp.position)?.department === filters.department);
    });
  }, [employees, filters, positions]);

  // Données pour les graphiques d'analyse
  const analysisData = useMemo<AnalysisData>(() => {
    const positionStats: AnalysisData = {};
    
    positions.forEach(position => {
      const positionEmployees = employees.filter(emp => emp.position === position.name);
      
      levels.forEach(level => {
        const levelEmployees = positionEmployees.filter(emp => emp.level === level);
        const salaries = levelEmployees.map(emp => convertCurrency(emp.salary, emp.currency, globalCurrency));
        
        if (salaries.length > 0) {
          const key = `${position.name}-${level}`;
          salaries.sort((a, b) => a - b);
          
          positionStats[key] = {
            position: position.name,
            level: level,
            employees: levelEmployees,
            salaries: salaries,
            min: Math.min(...salaries),
            max: Math.max(...salaries),
            median: salaries[Math.floor(salaries.length / 2)],
            average: Math.round(salaries.reduce((sum, s) => sum + s, 0) / salaries.length),
            count: salaries.length,
            range: position.salaryRanges[level] ? {
              min: convertCurrency(position.salaryRanges[level].min, 'EUR', globalCurrency),
              max: convertCurrency(position.salaryRanges[level].max, 'EUR', globalCurrency)
            } : null
          };
        }
      });
    });
    
    return positionStats;
  }, [employees, positions, globalCurrency]);

  // Composant Modal générique
  const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;
    
    const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
      sm: 'max-w-md',
      md: 'max-w-2xl',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl'
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className={`bg-white rounded-xl shadow-2xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}>
          <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

  // Composant Graphique en Moustaches
  const BoxPlotChart: React.FC<BoxPlotChartProps> = ({ data, title }) => {
    const maxValue = Math.max(...Object.values(data).flatMap(d => [d.max, d.range?.max || 0]));
    const minValue = Math.min(...Object.values(data).flatMap(d => [d.min, d.range?.min || maxValue]));
    const chartHeight = 400;
    const chartWidth = 800;

    const getY = (value: number): number => chartHeight - 50 - ((value - minValue) / (maxValue - minValue)) * (chartHeight - 100);
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
        <div className="overflow-x-auto">
          <svg width={chartWidth} height={chartHeight} className="border rounded">
            <defs>
              <linearGradient id="boxGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: '#1E40AF', stopOpacity: 0.8 }} />
              </linearGradient>
            </defs>
            
            {Object.values(data).map((item, index) => {
              const x = 100 + index * 120;
              const q1 = item.salaries[Math.floor(item.salaries.length * 0.25)] || item.min;
              const q3 = item.salaries[Math.floor(item.salaries.length * 0.75)] || item.max;
              
              return (
                <g key={index}>
                  {/* Fourchette théorique (gris clair) */}
                  {item.range && (
                    <rect
                      x={x - 25}
                      y={getY(item.range.max)}
                      width={50}
                      height={getY(item.range.min) - getY(item.range.max)}
                      fill="#E5E7EB"
                      stroke="#9CA3AF"
                      strokeWidth={1}
                      opacity={0.7}
                    />
                  )}
                  
                  {/* Ligne min-max */}
                  <line x1={x} y1={getY(item.min)} x2={x} y2={getY(item.max)} stroke="#374151" strokeWidth={2} />
                  
                  {/* Box (Q1-Q3) */}
                  <rect
                    x={x - 15}
                    y={getY(q3)}
                    width={30}
                    height={getY(q1) - getY(q3)}
                    fill="url(#boxGradient)"
                    stroke="#1E40AF"
                    strokeWidth={2}
                  />
                  
                  {/* Médiane */}
                  <line x1={x - 15} y1={getY(item.median)} x2={x + 15} y2={getY(item.median)} stroke="#DC2626" strokeWidth={3} />
                  
                  {/* Points individuels */}
                  {item.employees.map((emp, empIndex) => {
                    const salary = convertCurrency(emp.salary, emp.currency, globalCurrency);
                    const isOutOfRange = item.range && (salary < item.range.min || salary > item.range.max);
                    
                    return (
                      <circle
                        key={empIndex}
                        cx={x + (empIndex - item.employees.length / 2) * 5}
                        cy={getY(salary)}
                        r={4}
                        fill={isOutOfRange ? "#DC2626" : "#10B981"}
                        stroke={isOutOfRange ? "#991B1B" : "#047857"}
                        strokeWidth={2}
                        className="cursor-pointer hover:r-6 transition-all"
                      />
                    );
                  })}
                  
                  {/* Libellés */}
                  <text x={x} y={chartHeight - 20} textAnchor="middle" className="text-xs fill-gray-600">
                    {item.level}
                  </text>
                  <text x={x} y={chartHeight - 5} textAnchor="middle" className="text-xs fill-gray-600 font-semibold">
                    {item.position}
                  </text>
                </g>
              );
            })}
            
            {/* Axe Y avec valeurs */}
            {Array.from({ length: 6 }, (_, i) => {
              const value = minValue + (maxValue - minValue) * i / 5;
              const y = getY(value);
              return (
                <g key={i}>
                  <line x1={50} y1={y} x2={chartWidth - 50} y2={y} stroke="#E5E7EB" strokeWidth={1} />
                  <text x={40} y={y + 4} textAnchor="end" className="text-xs fill-gray-600">
                    {Math.round(value).toLocaleString()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  // Formulaire d'ajout/modification d'employé
  const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSave, onClose }) => {
    const [formData, setFormData] = useState<Partial<Employee>>(employee || {
      firstName: '',
      lastName: '',
      position: '',
      level: 'Junior',
      salary: 0,
      bonus: 0,
      type: 'CDI',
      startDate: '',
      currency: 'EUR',
      department: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.firstName || !formData.lastName || !formData.position || !formData.salary || !formData.startDate) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }

      const newEmployee: Employee = {
        ...formData,
        id: employee?.id || Date.now(),
        salary: parseInt(String(formData.salary)),
        bonus: parseInt(String(formData.bonus)) || 0,
        history: employee?.history || [{
          date: formData.startDate as string,
          salary: parseInt(String(formData.salary)),
          bonus: parseInt(String(formData.bonus)) || 0,
          reason: employee ? 'Modification' : 'Embauche'
        }],
        level: formData.level as 'Junior' | 'Intermédiaire' | 'Senior',
        type: formData.type as 'CDI' | 'Service Provider',
        currency: formData.currency as keyof ExchangeRates,
        department: formData.department || positions.find(p => p.name === formData.position)?.department || '',
        position: formData.position as string,
        startDate: formData.startDate as string,
        firstName: formData.firstName as string,
        lastName: formData.lastName as string
      };

      onSave(newEmployee);
    };

    return (
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prénom *
          </label>
          <input
            type="text"
            value={formData.firstName || ''}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom *
          </label>
          <input
            type="text"
            value={formData.lastName || ''}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poste *
          </label>
          <select
            value={formData.position || ''}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Sélectionner un poste</option>
            {positions.map(pos => (
              <option key={pos.id} value={pos.name}>{pos.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Niveau *
          </label>
          <select
            value={formData.level || 'Junior'}
            onChange={(e) => setFormData({ ...formData, level: e.target.value as 'Junior' | 'Intermédiaire' | 'Senior' })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salaire annuel * ({formData.currency})
          </label>
          <input
            type="number"
            value={formData.salary || ''}
            onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) || 0 })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bonus annuel ({formData.currency})
          </label>
          <input
            type="number"
            value={formData.bonus || ''}
            onChange={(e) => setFormData({ ...formData, bonus: parseInt(e.target.value) || 0 })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type *
          </label>
          <select
            value={formData.type || 'CDI'}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'CDI' | 'Service Provider' })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="CDI">CDI</option>
            <option value="Service Provider">Service Provider</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date d'entrée *
          </label>
          <input
            type="date"
            value={formData.startDate || ''}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Devise
          </label>
          <select
            value={formData.currency || 'EUR'}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value as keyof ExchangeRates })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {currencies.map(curr => (
              <option key={curr} value={curr}>{curr}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2 flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            {employee ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </form>
    );
  };

  // Formulaire d'ajout de poste
const PositionForm: React.FC<PositionFormProps> = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState<{
    name: string;
    department: string;
    description: string;
    skills: string[];
    objectives: string;
    salaryRanges: {
      [key: string]: { min: number; max: number };
    };
  }>({
    name: '',
    department: '',
    description: '',
    skills: [],
    objectives: '',
    salaryRanges: {
      Junior: { min: 0, max: 0 },
      Intermédiaire: { min: 0, max: 0 },
      Senior: { min: 0, max: 0 }
    }
  });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name) {
        alert('Le nom du poste est obligatoire');
        return;
      }

      const newPosition: Position = {
        id: Date.now(),
        name: formData.name || '',
        department: formData.department || '',
        description: formData.description || '',
        skills: formData.skills || [],
        objectives: formData.objectives || '',
        salaryRanges: {
          Junior: {
            min: parseInt(String(formData.salaryRanges?.Junior?.min)) || 0,
            max: parseInt(String(formData.salaryRanges?.Junior?.max)) || 0
          },
          Intermédiaire: {
            min: parseInt(String(formData.salaryRanges?.Intermédiaire?.min)) || 0,
            max: parseInt(String(formData.salaryRanges?.Intermédiaire?.max)) || 0
          },
          Senior: {
            min: parseInt(String(formData.salaryRanges?.Senior?.min)) || 0,
            max: parseInt(String(formData.salaryRanges?.Senior?.max)) || 0
          }
        }
      };

      onSave(newPosition);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du poste *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Département
            </label>
            <input
              type="text"
              value={formData.department || ''}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description du poste
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compétences requises (séparées par des virgules)
          </label>
          <input
            type="text"
            value={formData.skills?.join(', ') || ''}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="React, JavaScript, CSS..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Objectifs / Résultats attendus
          </label>
          <textarea
            value={formData.objectives || ''}
            onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
        </div>

       <div>
  <label className="block text-sm font-medium text-gray-700">
    Fourchettes salariales par niveau (EUR)
  </label>
  <div className="space-y-3">
    {levels.map(level => (
      <div key={level} className="grid grid-cols-3 gap-4 items-center">
        <label htmlFor={`min-salary-${level}`} className="font-medium text-gray-700">
          {level}
        </label>
        <input
          id={`min-salary-${level}`}
          type="number"
          placeholder="Min"
          value={formData.salaryRanges?.[level]?.min ?? ''}
          onChange={(e) => setFormData({
            ...formData,
            salaryRanges: {
              ...(formData.salaryRanges || {}),
              [level]: {
                ...(formData.salaryRanges?.[level] || {}),
                min: e.target.value ? parseInt(e.target.value) : 0,
              },
            },
          })}
          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
        <input
          id={`max-salary-${level}`}
          type="number"
          placeholder="Max"
          value={formData.salaryRanges?.[level]?.max ?? ''}
          onChange={(e) => setFormData({
            ...formData,
            salaryRanges: {
              ...(formData.salaryRanges || {}),
              [level]: {
                ...(formData.salaryRanges?.[level] || {}),
                max: e.target.value ? parseInt(e.target.value) : 0,
              },
            },
          })}
          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>
    ))}
  </div>
</div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            Créer le poste
          </button>
        </div>
      </form>
    );
  };

  // Gestionnaires d'événements
  const handleAddEmployee = (newEmployee: Employee) => {
    if (editingEmployee) {
      setEmployees(employees.map(emp => emp.id === editingEmployee.id ? newEmployee : emp));
      setEditingEmployee(null);
    } else {
      setEmployees([...employees, newEmployee]);
    }
    setShowAddEmployee(false);
  };

  const handleDeleteEmployee = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce collaborateur ?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const handleAddPosition = (newPosition: Position) => {
    setPositions([...positions, newPosition]);
    setShowAddPosition(false);
  };

  const handleDeletePosition = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce poste ?')) {
      setPositions(positions.filter(pos => pos.id !== id));
    }
  };

  const updateSalaryRange = (positionId: number, level: keyof Position['salaryRanges'], field: 'min' | 'max', value: number) => {
    setPositions(positions.map(pos => {
      if (pos.id === positionId) {
        return {
          ...pos,
          salaryRanges: {
            ...pos.salaryRanges,
            [level]: {
              ...pos.salaryRanges[level],
              [field]: value
            }
          }
        };
      }
      return pos;
    }));
  };

  // Données benchmark simulées
  const benchmarkData: BenchmarkData = {
    'Développeur Frontend': {
      france: { junior: 42000, intermédiaire: 58000, senior: 78000 },
      international: { junior: 45000, intermédiaire: 65000, senior: 85000 },
      market: { junior: 40000, intermédiaire: 55000, senior: 75000 }
    },
    'Développeur Backend': {
      france: { junior: 45000, intermédiaire: 62000, senior: 82000 },
      international: { junior: 48000, intermédiaire: 68000, senior: 88000 },
      market: { junior: 43000, intermédiaire: 60000, senior: 80000 }
    },
    'Product Manager': {
      france: { junior: 52000, intermédiaire: 72000, senior: 95000 },
      international: { junior: 55000, intermédiaire: 78000, senior: 105000 },
      market: { junior: 50000, intermédiaire: 70000, senior: 90000 }
    },
    'Designer UX/UI': {
      france: { junior: 40000, intermédiaire: 55000, senior: 72000 },
      international: { junior: 42000, intermédiaire: 58000, senior: 78000 },
      market: { junior: 38000, intermédiaire: 52000, senior: 68000 }
    },
    'Data Scientist': {
      france: { junior: 48000, intermédiaire: 68000, senior: 88000 },
      international: { junior: 52000, intermédiaire: 75000, senior: 98000 },
      market: { junior: 45000, intermédiaire: 65000, senior: 85000 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Gestion des Salaires & Grilles RH
              </h1>
              <p className="text-gray-600 mt-1">Pilotez vos politiques salariales avec précision</p>
            </div>
            
            {/* Sélecteur de devise global */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Devise d'affichage:</label>
              <select
                value={globalCurrency}
                onChange={(e) => setGlobalCurrency(e.target.value as keyof ExchangeRates)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {currencies.map(curr => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex space-x-1 mt-6 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'employees', label: 'Collaborateurs', icon: Users },
              { key: 'salary-grid', label: 'Grille Salariale', icon: BarChart3 },
              { key: 'analysis', label: 'Analyse', icon: TrendingUp },
              { key: 'benchmark', label: 'Benchmark', icon: Target }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === key
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white'
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Onglet Collaborateurs */}
        {activeTab === 'employees' && (
          <div className="space-y-6">
            {/* Actions et filtres */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowAddEmployee(true)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <Plus size={20} />
                    <span>Ajouter un collaborateur</span>
                  </button>

                  <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    <Download size={20} />
                    <span>Export CSV</span>
                  </button>

                  <button className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                    <Upload size={20} />
                    <span>Import CSV</span>
                  </button>
                </div>

                {/* Filtres */}
                <div className="flex space-x-3">
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tous les types</option>
                    <option value="CDI">CDI</option>
                    <option value="Service Provider">Service Provider</option>
                  </select>

                  <select
                    value={filters.position}
                    onChange={(e) => setFilters({ ...filters, position: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tous les postes</option>
                    {positions.map(pos => (
                      <option key={pos.id} value={pos.name}>{pos.name}</option>
                    ))}
                  </select>

                  <select
                    value={filters.department}
                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tous les départements</option>
                    {Array.from(new Set(positions.map(p => p.department))).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tableau des collaborateurs */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="text-left p-4 font-semibold text-gray-700">Collaborateur</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Poste</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Niveau</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Département</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Salaire</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Bonus</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Type</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Ancienneté</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((employee) => {
                      const position = positions.find(p => p.name === employee.position);
                      const salaryInGlobalCurrency = convertCurrency(employee.salary, employee.currency, globalCurrency);
                      const bonusInGlobalCurrency = convertCurrency(employee.bonus, employee.currency, globalCurrency);
                      
                      return (
                        <tr key={employee.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                          <td className="p-4">
                            <button
                              onClick={() => setSelectedEmployee(employee)}
                              className="text-left hover:text-blue-600 transition-colors"
                            >
                              <div className="font-semibold text-gray-800">{employee.firstName} {employee.lastName}</div>
                            </button>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => setSelectedPosition(position || null)}
                              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                              {employee.position}
                            </button>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              employee.level === 'Junior' ? 'bg-green-100 text-green-800' :
                              employee.level === 'Intermédiaire' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {employee.level}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600">{position?.department || '-'}</td>
                          <td className="p-4 font-semibold text-gray-800">
                            {salaryInGlobalCurrency.toLocaleString()} {globalCurrency}
                          </td>
                          <td className="p-4 text-gray-600">
                            {bonusInGlobalCurrency.toLocaleString()} {globalCurrency}
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              employee.type === 'CDI' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {employee.type}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600">{calculateSeniority(employee.startDate)}</td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditingEmployee(employee);
                                  setShowAddEmployee(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteEmployee(employee.id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Grille Salariale */}
        {activeTab === 'salary-grid' && (
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Grille des Salaires</h2>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowAddPosition(true)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <Plus size={20} />
                    <span>Ajouter un poste</span>
                  </button>

                  <button className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                    <Upload size={20} />
                    <span>Importer grille</span>
                  </button>
                </div>
              </div>

              {/* Tableau de la grille */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="text-left p-4 font-semibold text-gray-700">Poste</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Département</th>
                      {levels.map(level => (
                        <th key={level} className="text-center p-4 font-semibold text-gray-700" colSpan={2}>
                          {level}
                        </th>
                      ))}
                      <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                    <tr className="bg-gray-50">
                      <th></th>
                      <th></th>
                      {levels.map(level => (
                        <React.Fragment key={level}>
                          <th className="text-center p-2 text-sm text-gray-600">Min</th>
                          <th className="text-center p-2 text-sm text-gray-600">Max</th>
                        </React.Fragment>
                      ))}
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((position) => (
                      <tr key={position.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                        <td className="p-4">
                          <button
                            onClick={() => setSelectedPosition(position)}
                            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors text-left"
                          >
                            {position.name}
                          </button>
                        </td>
                        <td className="p-4 text-gray-600">{position.department}</td>
                        {levels.map(level => {
                          const range = position.salaryRanges[level];
                          const minInGlobalCurrency = convertCurrency(range?.min || 0, 'EUR', globalCurrency);
                          const maxInGlobalCurrency = convertCurrency(range?.max || 0, 'EUR', globalCurrency);
                          
                          return (
                            <React.Fragment key={level}>
                              <td className="p-2">
                                <input
                                  type="number"
                                  value={minInGlobalCurrency || ''}
                                  onChange={(e) => updateSalaryRange(position.id, level, 'min', convertCurrency(parseInt(e.target.value) || 0, globalCurrency, 'EUR'))}
                                  className="w-20 p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                  placeholder="Min"
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  value={maxInGlobalCurrency || ''}
                                  onChange={(e) => updateSalaryRange(position.id, level, 'max', convertCurrency(parseInt(e.target.value) || 0, globalCurrency, 'EUR'))}
                                  className="w-20 p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                  placeholder="Max"
                                />
                              </td>
                            </React.Fragment>
                          );
                        })}
                        <td className="p-4">
                          <button
                            onClick={() => handleDeletePosition(position.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Analyse */}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Statistiques globales */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Statistiques Globales</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(analysisData).map(([key, data]) => (
                    <div key={key} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600">{data.position} - {data.level}</div>
                      <div className="text-2xl font-bold text-gray-800">{data.average.toLocaleString()} {globalCurrency}</div>
                      <div className="text-xs text-gray-500">
                        {data.min.toLocaleString()} - {data.max.toLocaleString()} {globalCurrency}
                      </div>
                      <div className="flex items-center mt-2">
                        <div className={`w-3 h-3 rounded-full mr-2 ${data.count > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm text-gray-600">{data.count} collaborateur(s)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collaborateurs hors fourchette */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Alertes Salariales</h3>
                <div className="space-y-3">
                  {employees.map(emp => {
                    const position = positions.find(p => p.name === emp.position);
                    if (!position || !position.salaryRanges[emp.level]) return null;
                    
                    const range = position.salaryRanges[emp.level];
                    const salary = convertCurrency(emp.salary, emp.currency, globalCurrency);
                    const minRange = convertCurrency(range.min, 'EUR', globalCurrency);
                    const maxRange = convertCurrency(range.max, 'EUR', globalCurrency);
                    
                    const isOutOfRange = salary < minRange || salary > maxRange;
                    if (!isOutOfRange) return null;
                    
                    const variance = salary < minRange ? 
                      ((minRange - salary) / minRange * 100).toFixed(1) :
                      ((salary - maxRange) / maxRange * 100).toFixed(1);
                    
                    return (
                      <div key={emp.id} className={`p-4 rounded-lg border-l-4 ${
                        salary < minRange ? 'bg-yellow-50 border-yellow-400' : 'bg-red-50 border-red-400'
                      }`}>
                        <div className="font-semibold text-gray-800">
                          {emp.firstName} {emp.lastName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {emp.position} - {emp.level}
                        </div>
                        <div className="text-sm font-medium">
                          Salaire: {salary.toLocaleString()} {globalCurrency} 
                          <span className={salary < minRange ? 'text-yellow-600' : 'text-red-600'}>
                            ({salary < minRange ? '-' : '+'}{variance}% vs fourchette)
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Fourchette: {minRange.toLocaleString()} - {maxRange.toLocaleString()} {globalCurrency}
                        </div>
                      </div>
                    );
                  }).filter(Boolean)}
                  
                  {employees.every(emp => {
                    const position = positions.find(p => p.name === emp.position);
                    if (!position || !position.salaryRanges[emp.level]) return true;
                    const range = position.salaryRanges[emp.level];
                    const salary = convertCurrency(emp.salary, emp.currency, globalCurrency);
                    const minRange = convertCurrency(range.min, 'EUR', globalCurrency);
                    const maxRange = convertCurrency(range.max, 'EUR', globalCurrency);
                    return salary >= minRange && salary <= maxRange;
                  }) && (
                    <div className="text-center text-green-600 py-8">
                      <div className="text-2xl mb-2">✓</div>
                      <div>Tous les salaires sont dans les fourchettes définies</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Graphiques en moustaches */}
            <BoxPlotChart 
              data={analysisData} 
              title="Analyse des Salaires par Poste et Niveau"
            />
          </div>
        )}

        {/* Onglet Benchmark */}
        {activeTab === 'benchmark' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Benchmark de Marché</h2>
              
              {/* Tableau de comparaison */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="text-left p-4 font-semibold text-gray-700">Poste</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Niveau</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Votre Entreprise</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Marché France</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Marché International</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Marché Général</th>
                      <th className="text-center p-4 font-semibold text-gray-700">Écart vs Marché</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(benchmarkData).map(([positionName, benchData]) => 
                      levels.map(level => {
                        const levelKey = level.toLowerCase().replace('é', 'e') as 'junior' | 'intermédiaire' | 'senior';
                        const actualData = analysisData[`${positionName}-${level}`];
                        const marketSalary = convertCurrency(benchData.market[levelKey] || 0, 'EUR', globalCurrency);
                        const franceSalary = convertCurrency(benchData.france[levelKey] || 0, 'EUR', globalCurrency);
                        const intlSalary = convertCurrency(benchData.international[levelKey] || 0, 'EUR', globalCurrency);
                        
                        const yourSalary = actualData ? actualData.average : 0;
                        const gap = yourSalary && marketSalary ? ((yourSalary - marketSalary) / marketSalary * 100) : 0;
                        
                        return (
                          <tr key={`${positionName}-${level}`} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                            <td className="p-4 font-medium text-gray-800">{positionName}</td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                level === 'Junior' ? 'bg-green-100 text-green-800' :
                                level === 'Intermédiaire' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {level}
                              </span>
                            </td>
                            <td className="p-4 text-center font-semibold">
                              {yourSalary ? `${yourSalary.toLocaleString()} ${globalCurrency}` : 'N/A'}
                            </td>
                            <td className="p-4 text-center">{franceSalary.toLocaleString()} {globalCurrency}</td>
                            <td className="p-4 text-center">{intlSalary.toLocaleString()} {globalCurrency}</td>
                            <td className="p-4 text-center font-medium">{marketSalary.toLocaleString()} {globalCurrency}</td>
                            <td className="p-4 text-center">
                              {yourSalary ? (
                                <span className={`font-semibold ${
                                  gap > 5 ? 'text-green-600' : 
                                  gap < -5 ? 'text-red-600' : 
                                  'text-yellow-600'
                                }`}>
                                  {gap > 0 ? '+' : ''}{gap.toFixed(1)}%
                                </span>
                              ) : 'N/A'}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Recommandations d'audit */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <h4 className="font-semibold text-green-800">Postes Compétitifs</h4>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(benchmarkData).map(([positionName, benchData]) => {
                      const avgGap = levels.reduce((acc, level) => {
                        const levelKey = level.toLowerCase().replace('é', 'e') as 'junior' | 'intermédiaire' | 'senior';
                        const actualData = analysisData[`${positionName}-${level}`];
                        const marketSalary = benchData.market[levelKey] || 0;
                        const yourSalary = actualData ? actualData.average : 0;
                        const gap = yourSalary && marketSalary ? ((yourSalary - marketSalary) / marketSalary * 100) : 0;
                        return acc + gap;
                      }, 0) / levels.length;
                      
                      if (avgGap >= 0) {
                        return (
                          <div key={positionName} className="text-sm text-green-700">
                            {positionName}: +{avgGap.toFixed(1)}% vs marché
                          </div>
                        );
                      }
                      return null;
                    }).filter(Boolean)}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <h4 className="font-semibold text-yellow-800">À Surveiller</h4>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(benchmarkData).map(([positionName, benchData]) => {
                      const avgGap = levels.reduce((acc, level) => {
                        const levelKey = level.toLowerCase().replace('é', 'e') as 'junior' | 'intermédiaire' | 'senior';
                        const actualData = analysisData[`${positionName}-${level}`];
                        const marketSalary = benchData.market[levelKey] || 0;
                        const yourSalary = actualData ? actualData.average : 0;
                        const gap = yourSalary && marketSalary ? ((yourSalary - marketSalary) / marketSalary * 100) : 0;
                        return acc + gap;
                      }, 0) / levels.length;
                      
                      if (avgGap >= -5 && avgGap < 0) {
                        return (
                          <div key={positionName} className="text-sm text-yellow-700">
                            {positionName}: {avgGap.toFixed(1)}% vs marché
                          </div>
                        );
                      }
                      return null;
                    }).filter(Boolean)}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <h4 className="font-semibold text-red-800">Action Requise</h4>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(benchmarkData).map(([positionName, benchData]) => {
                      const avgGap = levels.reduce((acc, level) => {
                        const levelKey = level.toLowerCase().replace('é', 'e') as 'junior' | 'intermédiaire' | 'senior';
                        const actualData = analysisData[`${positionName}-${level}`];
                        const marketSalary = benchData.market[levelKey] || 0;
                        const yourSalary = actualData ? actualData.average : 0;
                        const gap = yourSalary && marketSalary ? ((yourSalary - marketSalary) / marketSalary * 100) : 0;
                        return acc + gap;
                      }, 0) / levels.length;
                      
                      if (avgGap < -5) {
                        return (
                          <div key={positionName} className="text-sm text-red-700">
                            {positionName}: {avgGap.toFixed(1)}% vs marché
                          </div>
                        );
                      }
                      return null;
                    }).filter(Boolean)}
                  </div>
                </div>
              </div>

              {/* Graphique de comparaison */}
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Comparaison Visuelle - Salaires Moyens</h4>
                <div className="space-y-4">
                  {Object.entries(benchmarkData).slice(0, 3).map(([positionName, benchData]) => {
                    const actualData = analysisData[`${positionName}-Senior`];
                    const yourSalary = actualData ? convertCurrency(actualData.average, 'EUR', globalCurrency) : 0;
                    const marketSalary = convertCurrency(benchData.market.senior, 'EUR', globalCurrency);
                    const franceSalary = convertCurrency(benchData.france.senior, 'EUR', globalCurrency);
                    const intlSalary = convertCurrency(benchData.international.senior, 'EUR', globalCurrency);
                    
                    const maxSalary = Math.max(yourSalary, marketSalary, franceSalary, intlSalary);
                    
                    return (
                      <div key={positionName} className="space-y-2">
                        <div className="font-medium text-gray-700">{positionName} - Senior</div>
                        <div className="space-y-1">
                          {[
                            { label: 'Votre Entreprise', value: yourSalary, color: 'bg-blue-500' },
                            { label: 'Marché France', value: franceSalary, color: 'bg-green-500' },
                            { label: 'Marché International', value: intlSalary, color: 'bg-purple-500' },
                            { label: 'Marché Général', value: marketSalary, color: 'bg-orange-500' }
                          ].map(({ label, value, color }) => (
                            <div key={label} className="flex items-center space-x-3">
                              <div className="w-24 text-sm text-gray-600">{label}</div>
                              <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                                <div 
                                  className={`${color} h-4 rounded-full transition-all duration-500`}
                                  style={{ width: `${(value / maxSalary) * 100}%` }}
                                ></div>
                                <div className="absolute inset-0 flex items-center justify-end pr-2">
                                  <span className="text-xs font-medium text-white">
                                    {value ? `${value.toLocaleString()} ${globalCurrency}` : 'N/A'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      
      {/* Modal détail employé */}
      <Modal
        isOpen={selectedEmployee !== null}
        onClose={() => setSelectedEmployee(null)}
        title={`Fiche de ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}`}
        size="lg"
      >
        {selectedEmployee && (
          <div className="space-y-6">
            {/* Informations générales */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Poste</label>
                  <div className="text-lg font-semibold text-gray-800">{selectedEmployee.position}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Niveau</label>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedEmployee.level === 'Junior' ? 'bg-green-100 text-green-800' :
                    selectedEmployee.level === 'Intermédiaire' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedEmployee.level}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Type de contrat</label>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedEmployee.type === 'CDI' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {selectedEmployee.type}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Salaire annuel</label>
                  <div className="text-lg font-semibold text-gray-800">
                    {convertCurrency(selectedEmployee.salary, selectedEmployee.currency, globalCurrency).toLocaleString()} {globalCurrency}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Bonus annuel</label>
                  <div className="text-lg font-semibold text-gray-800">
                    {convertCurrency(selectedEmployee.bonus, selectedEmployee.currency, globalCurrency).toLocaleString()} {globalCurrency}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Ancienneté</label>
                  <div className="text-lg font-semibold text-gray-800">{calculateSeniority(selectedEmployee.startDate)}</div>
                </div>
              </div>
            </div>

            {/* Historique salarial */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Historique des Évolutions</h4>
              <div className="space-y-3">
                {selectedEmployee.history?.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800">{entry.reason}</div>
                      <div className="text-sm text-gray-600">{new Date(entry.date).toLocaleDateString('fr-FR')}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">
                        {convertCurrency(entry.salary, selectedEmployee.currency, globalCurrency).toLocaleString()} {globalCurrency}
                      </div>
                      {entry.bonus > 0 && (
                        <div className="text-sm text-gray-600">
                          + {convertCurrency(entry.bonus, selectedEmployee.currency, globalCurrency).toLocaleString()} {globalCurrency} bonus
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Positionnement vs fourchette */}
            {(() => {
              const position = positions.find(p => p.name === selectedEmployee.position);
              if (!position || !position.salaryRanges[selectedEmployee.level]) return null;
              
              const range = position.salaryRanges[selectedEmployee.level];
              const salary = convertCurrency(selectedEmployee.salary, selectedEmployee.currency, globalCurrency);
              const minRange = convertCurrency(range.min, 'EUR', globalCurrency);
              const maxRange = convertCurrency(range.max, 'EUR', globalCurrency);
              const position_pct = ((salary - minRange) / (maxRange - minRange)) * 100;
              
              return (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Positionnement dans la Fourchette</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Min: {minRange.toLocaleString()} {globalCurrency}</span>
                      <span>Max: {maxRange.toLocaleString()} {globalCurrency}</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-4 relative">
                      <div
                        className="bg-blue-500 h-4 rounded-full"
                        style={{ width: `${Math.min(Math.max(position_pct, 0), 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-center text-sm text-gray-600">
                      Position: {position_pct.toFixed(1)}% dans la fourchette
                      {salary < minRange && <span className="text-yellow-600"> (Sous la fourchette)</span>}
                      {salary > maxRange && <span className="text-red-600"> (Au-dessus de la fourchette)</span>}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </Modal>

      {/* Modal détail poste */}
      <Modal
        isOpen={selectedPosition !== null}
        onClose={() => setSelectedPosition(null)}
        title={`Fiche du poste: ${selectedPosition?.name}`}
        size="xl"
      >
        {selectedPosition && (
          <div className="space-y-6">
            {/* Informations générales */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Département</label>
                  <div className="text-lg font-semibold text-gray-800">{selectedPosition.department}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <div className="text-gray-800">{selectedPosition.description}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Objectifs</label>
                  <div className="text-gray-800">{selectedPosition.objectives}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Compétences requises</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedPosition.skills?.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Statistiques</label>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-700">
                      Collaborateurs: {employees.filter(emp => emp.position === selectedPosition.name).length}
                    </div>
                    <div className="text-sm text-gray-700">
                      Niveaux couverts: {levels.filter(level => 
                        employees.some(emp => emp.position === selectedPosition.name && emp.level === level)
                      ).join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fourchettes par niveau */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Fourchettes Salariales par Niveau</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {levels.map(level => {
                  const range = selectedPosition.salaryRanges[level];
                  const minRange = convertCurrency(range?.min || 0, 'EUR', globalCurrency);
                  const maxRange = convertCurrency(range?.max || 0, 'EUR', globalCurrency);
                  const levelEmployees = employees.filter(emp => emp.position === selectedPosition.name && emp.level === level);
                  
                  return (
                    <div key={level} className="bg-gray-50 rounded-lg p-4">
                      <div className="font-semibold text-gray-800 mb-2">{level}</div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">
                          Fourchette: {minRange.toLocaleString()} - {maxRange.toLocaleString()} {globalCurrency}
                        </div>
                        <div className="text-sm text-gray-600">
                          Collaborateurs: {levelEmployees.length}
                        </div>
                        {levelEmployees.length > 0 && (
                          <div className="text-sm text-gray-600">
                            Salaire moyen: {Math.round(
                              levelEmployees.reduce((sum, emp) => sum + convertCurrency(emp.salary, emp.currency, globalCurrency), 0) / levelEmployees.length
                            ).toLocaleString()} {globalCurrency}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Graphique BoxPlot pour ce poste */}
            {(() => {
              const positionAnalysisData: AnalysisData = {};
              levels.forEach(level => {
                const key = `${selectedPosition.name}-${level}`;
                if (analysisData[key]) {
                  positionAnalysisData[key] = analysisData[key];
                }
              });
              
              if (Object.keys(positionAnalysisData).length > 0) {
                return <BoxPlotChart data={positionAnalysisData} title={`Répartition des Salaires - ${selectedPosition.name}`} />;
              }
              return null;
            })()}

            {/* Liste des collaborateurs */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Collaborateurs sur ce Poste</h4>
              <div className="space-y-3">
                {employees.filter(emp => emp.position === selectedPosition.name).map(emp => (
                  <div key={emp.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800">{emp.firstName} {emp.lastName}</div>
                      <div className="text-sm text-gray-600">{emp.level} - {emp.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">
                        {convertCurrency(emp.salary, emp.currency, globalCurrency).toLocaleString()} {globalCurrency}
                      </div>
                      <div className="text-sm text-gray-600">{calculateSeniority(emp.startDate)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal ajout/modification employé */}
      <Modal
        isOpen={showAddEmployee}
        onClose={() => {
          setShowAddEmployee(false);
          setEditingEmployee(null);
        }}
        title={editingEmployee ? 'Modifier le collaborateur' : 'Ajouter un collaborateur'}
        size="lg"
      >
        <EmployeeForm
          employee={editingEmployee}
          onSave={handleAddEmployee}
          onClose={() => {
            setShowAddEmployee(false);
            setEditingEmployee(null);
          }}
        />
      </Modal>

      {/* Modal ajout poste */}
      <Modal
        isOpen={showAddPosition}
        onClose={() => setShowAddPosition(false)}
        title="Créer un nouveau poste"
        size="lg"
      >
        <PositionForm
          onSave={handleAddPosition}
          onClose={() => setShowAddPosition(false)}
        />
      </Modal>
    </div>
  );
};

export default App;