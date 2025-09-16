'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  CreditCard, 
  DollarSign, 
  Users, 
  Calendar, 
  Clock, 
  Star, 
  Gift, 
  Percent, 
  Tag, 
  Settings, 
  Eye, 
  Copy, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Zap,
  Globe,
  Shield,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon
} from 'lucide-react'

interface TicketTier {
  id: string
  name: string
  description: string
  price: number
  currency: string
  quantity: number
  sold: number
  available: number
  status: 'active' | 'paused' | 'sold_out' | 'draft'
  saleStart: string
  saleEnd: string
  features: string[]
  restrictions: string[]
  customFields: CustomField[]
  discounts: Discount[]
  earlyBird?: {
    price: number
    endDate: string
  }
  groupDiscount?: {
    minQuantity: number
    discountPercent: number
  }
}

interface CustomField {
  id: string
  name: string
  type: 'text' | 'email' | 'phone' | 'select' | 'checkbox' | 'textarea' | 'file' | 'date'
  required: boolean
  placeholder?: string
  options?: string[]
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
  }
}

interface Discount {
  id: string
  code: string
  type: 'percentage' | 'fixed' | 'buy_x_get_y'
  value: number
  maxUses: number
  used: number
  validFrom: string
  validTo: string
  applicableTickets: string[]
  conditions?: {
    minQuantity?: number
    maxQuantity?: number
    firstTimeBuyer?: boolean
  }
}

interface PaymentProvider {
  id: string
  name: string
  type: 'stripe' | 'paypal' | 'square' | 'razorpay' | 'bank_transfer'
  enabled: boolean
  fees: {
    percentage: number
    fixed: number
  }
  currencies: string[]
  settings: Record<string, any>
}

interface TicketingAnalytics {
  totalRevenue: number
  totalSold: number
  conversionRate: number
  averageOrderValue: number
  refundRate: number
  topSellingTier: string
  salesByDay: Array<{
    date: string
    sales: number
    revenue: number
  }>
  salesByTier: Array<{
    tierId: string
    name: string
    sold: number
    revenue: number
  }>
}

export default function AdvancedTicketing() {
  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>([])
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [paymentProviders, setPaymentProviders] = useState<PaymentProvider[]>([])
  const [analytics, setAnalytics] = useState<TicketingAnalytics | null>(null)
  const [activeTab, setActiveTab] = useState('tiers')
  const [showTierForm, setShowTierForm] = useState(false)
  const [showDiscountForm, setShowDiscountForm] = useState(false)
  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTicketingData()
  }, [])

  const loadTicketingData = async () => {
    try {
      // Mock ticket tiers
      const mockTiers: TicketTier[] = [
        {
          id: 'tier-1',
          name: 'Early Bird',
          description: 'Limited time early bird pricing with exclusive perks',
          price: 299,
          currency: 'USD',
          quantity: 500,
          sold: 387,
          available: 113,
          status: 'active',
          saleStart: '2024-01-01T00:00:00Z',
          saleEnd: '2024-02-15T23:59:59Z',
          features: [
            'Full conference access',
            'Welcome kit',
            'Networking sessions',
            'Digital materials',
            'Certificate of attendance'
          ],
          restrictions: [
            'Non-transferable',
            'No refunds after Feb 1st'
          ],
          customFields: [
            {
              id: 'field-1',
              name: 'Dietary Requirements',
              type: 'select',
              required: false,
              options: ['None', 'Vegetarian', 'Vegan', 'Gluten-free', 'Other']
            },
            {
              id: 'field-2',
              name: 'Company',
              type: 'text',
              required: true,
              placeholder: 'Enter your company name'
            }
          ],
          discounts: [],
          earlyBird: {
            price: 249,
            endDate: '2024-01-31T23:59:59Z'
          }
        },
        {
          id: 'tier-2',
          name: 'VIP Experience',
          description: 'Premium experience with exclusive access and perks',
          price: 799,
          currency: 'USD',
          quantity: 100,
          sold: 67,
          available: 33,
          status: 'active',
          saleStart: '2024-01-01T00:00:00Z',
          saleEnd: '2024-03-10T23:59:59Z',
          features: [
            'All Early Bird features',
            'VIP lounge access',
            'Priority seating',
            'Exclusive speaker meet & greet',
            'Premium welcome kit',
            'Dedicated concierge',
            'Private networking dinner'
          ],
          restrictions: [
            'Limited to 100 tickets',
            'ID verification required'
          ],
          customFields: [
            {
              id: 'field-3',
              name: 'Special Requests',
              type: 'textarea',
              required: false,
              placeholder: 'Any special requests or accommodations needed'
            }
          ],
          discounts: [],
          groupDiscount: {
            minQuantity: 5,
            discountPercent: 15
          }
        },
        {
          id: 'tier-3',
          name: 'Student',
          description: 'Special pricing for students with valid ID',
          price: 99,
          currency: 'USD',
          quantity: 200,
          sold: 156,
          available: 44,
          status: 'active',
          saleStart: '2024-01-15T00:00:00Z',
          saleEnd: '2024-03-10T23:59:59Z',
          features: [
            'Full conference access',
            'Digital materials',
            'Student networking session',
            'Certificate of attendance'
          ],
          restrictions: [
            'Valid student ID required',
            'One ticket per student',
            'Non-transferable'
          ],
          customFields: [
            {
              id: 'field-4',
              name: 'Student ID',
              type: 'file',
              required: true
            },
            {
              id: 'field-5',
              name: 'University',
              type: 'text',
              required: true,
              placeholder: 'Enter your university name'
            }
          ],
          discounts: []
        }
      ]

      // Mock discounts
      const mockDiscounts: Discount[] = [
        {
          id: 'discount-1',
          code: 'WECON2024',
          type: 'percentage',
          value: 20,
          maxUses: 100,
          used: 67,
          validFrom: '2024-01-01T00:00:00Z',
          validTo: '2024-02-29T23:59:59Z',
          applicableTickets: ['tier-1', 'tier-2']
        },
        {
          id: 'discount-2',
          code: 'FIRSTTIME',
          type: 'fixed',
          value: 50,
          maxUses: 500,
          used: 234,
          validFrom: '2024-01-01T00:00:00Z',
          validTo: '2024-03-15T23:59:59Z',
          applicableTickets: ['tier-1'],
          conditions: {
            firstTimeBuyer: true
          }
        }
      ]

      // Mock payment providers
      const mockProviders: PaymentProvider[] = [
        {
          id: 'stripe',
          name: 'Stripe',
          type: 'stripe',
          enabled: true,
          fees: { percentage: 2.9, fixed: 0.30 },
          currencies: ['USD', 'EUR', 'GBP', 'AED'],
          settings: {}
        },
        {
          id: 'paypal',
          name: 'PayPal',
          type: 'paypal',
          enabled: true,
          fees: { percentage: 3.49, fixed: 0.49 },
          currencies: ['USD', 'EUR', 'GBP'],
          settings: {}
        }
      ]

      // Mock analytics
      const mockAnalytics: TicketingAnalytics = {
        totalRevenue: 234567,
        totalSold: 610,
        conversionRate: 12.5,
        averageOrderValue: 384.5,
        refundRate: 2.1,
        topSellingTier: 'Early Bird',
        salesByDay: [
          { date: '2024-03-01', sales: 23, revenue: 8970 },
          { date: '2024-03-02', sales: 31, revenue: 12450 },
          { date: '2024-03-03', sales: 18, revenue: 7230 },
          { date: '2024-03-04', sales: 45, revenue: 17890 },
          { date: '2024-03-05', sales: 29, revenue: 11670 }
        ],
        salesByTier: [
          { tierId: 'tier-1', name: 'Early Bird', sold: 387, revenue: 115713 },
          { tierId: 'tier-2', name: 'VIP Experience', sold: 67, revenue: 53533 },
          { tierId: 'tier-3', name: 'Student', sold: 156, revenue: 15444 }
        ]
      }

      setTicketTiers(mockTiers)
      setDiscounts(mockDiscounts)
      setPaymentProviders(mockProviders)
      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Error loading ticketing data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20'
      case 'paused': return 'text-yellow-400 bg-yellow-400/20'
      case 'sold_out': return 'text-red-400 bg-red-400/20'
      case 'draft': return 'text-gray-400 bg-gray-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle
      case 'paused': return AlertCircle
      case 'sold_out': return XCircle
      case 'draft': return Edit
      default: return Settings
    }
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount)
  }

  const calculateProgress = (sold: number, total: number) => {
    return Math.round((sold / total) * 100)
  }

  const filteredTiers = ticketTiers.filter(tier => {
    const matchesSearch = tier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tier.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || tier.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading ticketing system...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Advanced Ticketing System</h2>
          <p className="text-gray-400">Create unlimited ticket tiers, custom forms, and payment processing</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowDiscountForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-secondary/20 text-secondary border border-secondary/30 rounded-lg hover:bg-secondary/30 transition-colors"
          >
            <Percent className="w-4 h-4" />
            <span>Add Discount</span>
          </button>
          <button
            onClick={() => setShowTierForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Tier</span>
          </button>
        </div>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1">
                {formatCurrency(analytics.totalRevenue)}
              </p>
              <p className="text-gray-400 text-sm">Total Revenue</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1">
                {analytics.totalSold.toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm">Tickets Sold</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1">
                {analytics.conversionRate}%
              </p>
              <p className="text-gray-400 text-sm">Conversion Rate</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <CreditCard className="w-6 h-6 text-orange-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1">
                {formatCurrency(analytics.averageOrderValue)}
              </p>
              <p className="text-gray-400 text-sm">Avg Order Value</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <span className="text-red-400 text-sm">{analytics.refundRate}%</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1">
                {analytics.refundRate}%
              </p>
              <p className="text-gray-400 text-sm">Refund Rate</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex space-x-1 bg-white/5 rounded-lg p-1 mb-6">
          {[
            { id: 'tiers', label: 'Ticket Tiers', icon: Tag, count: ticketTiers.length },
            { id: 'discounts', label: 'Discounts', icon: Percent, count: discounts.length },
            { id: 'payments', label: 'Payment Providers', icon: CreditCard, count: paymentProviders.length },
            { id: 'analytics', label: 'Analytics', icon: BarChart3, count: 0 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="bg-primary/50 text-white text-xs rounded-full px-2 py-0.5">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Ticket Tiers Tab */}
        {activeTab === 'tiers' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tiers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="sold_out">Sold Out</option>
                <option value="draft">Draft</option>
              </select>

              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Ticket Tiers Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTiers.map((tier) => {
                const StatusIcon = getStatusIcon(tier.status)
                const progress = calculateProgress(tier.sold, tier.quantity)
                
                return (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden hover:border-primary/30 transition-colors"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">{tier.name}</h3>
                          <p className="text-gray-400 text-sm line-clamp-2">{tier.description}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(tier.status)}`}>
                            <StatusIcon className="w-3 h-3" />
                            <span className="capitalize">{tier.status.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-white">
                            {formatCurrency(tier.price, tier.currency)}
                          </span>
                          {tier.earlyBird && new Date() < new Date(tier.earlyBird.endDate) && (
                            <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-xs">
                              <Zap className="w-3 h-3" />
                              <span>Early Bird: {formatCurrency(tier.earlyBird.price, tier.currency)}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Sales Progress</span>
                            <span className="text-white">{tier.sold} / {tier.quantity}</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500">
                            {progress}% sold • {tier.available} remaining
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-xs text-gray-400">Features:</div>
                          <div className="flex flex-wrap gap-1">
                            {tier.features.slice(0, 3).map((feature, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full"
                              >
                                {feature}
                              </span>
                            ))}
                            {tier.features.length > 3 && (
                              <span className="px-2 py-1 bg-gray-400/20 text-gray-400 text-xs rounded-full">
                                +{tier.features.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedTier(tier)}
                            className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded text-sm hover:bg-primary/30 transition-colors"
                          >
                            Edit
                          </button>
                          <button className="p-1 text-gray-400 hover:text-white transition-colors" title="Duplicate">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-white transition-colors" title="Preview">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Revenue: {formatCurrency(tier.sold * tier.price, tier.currency)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Discounts Tab */}
        {activeTab === 'discounts' && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <Percent className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-white mb-2">Discount Management</h4>
              <p className="text-gray-400">Advanced discount and coupon system coming soon</p>
            </div>
          </div>
        )}

        {/* Payment Providers Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-white mb-2">Payment Integration</h4>
              <p className="text-gray-400">Payment provider configuration coming soon</p>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales by Tier */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-lg font-medium text-white mb-4">Sales by Tier</h4>
                <div className="space-y-3">
                  {analytics.salesByTier.map((tier) => (
                    <div key={tier.tierId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <h5 className="font-medium text-white">{tier.name}</h5>
                        <p className="text-sm text-gray-400">{tier.sold} tickets sold</p>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-medium">{formatCurrency(tier.revenue)}</div>
                        <div className="text-xs text-gray-500">revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Sales */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-lg font-medium text-white mb-4">Sales Trend</h4>
                <div className="space-y-3">
                  {analytics.salesByDay.map((day) => (
                    <div key={day.date} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <h5 className="font-medium text-white">
                          {new Date(day.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </h5>
                        <p className="text-sm text-gray-400">{day.sales} tickets</p>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-medium">{formatCurrency(day.revenue)}</div>
                        <div className="text-xs text-gray-500">daily revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
