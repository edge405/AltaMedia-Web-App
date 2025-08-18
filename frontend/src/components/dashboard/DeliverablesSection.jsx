import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

export default function DeliverablesSection({ 
  clientData, 
  searchTerm, 
  setSearchTerm, 
  filterStatus, 
  setFilterStatus, 
  filteredDeliverables 
}) {
  return (
    <div className="space-y-8">
      <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-black to-gray-900 text-white p-8">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="w-10 h-10 bg-[#f7e833] rounded-2xl flex items-center justify-center">
              <Search className="w-6 h-6 text-black" />
            </div>
            <span>Deliverables Gallery</span>
          </CardTitle>
          <p className="text-gray-300 mt-2">
            Review and download your project deliverables
          </p>
        </CardHeader>
        <CardContent className="p-8">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search deliverables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl bg-white text-gray-900 focus:border-[#f7e833] focus:outline-none transition-colors"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-6 py-4 border-2 border-gray-200 rounded-2xl bg-white text-gray-900 focus:border-[#f7e833] focus:outline-none transition-colors font-medium"
            >
              <option value="all">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="In Revision">In Revision</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDeliverables.map((deliverable) => (
              <div key={deliverable.id} className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <img
                    src={deliverable.thumbnail}
                    alt={deliverable.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-[#f7e833] text-black font-bold px-3 py-1 rounded-full text-sm">
                      {deliverable.status}
                    </Badge>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">{deliverable.title}</h4>
                    <p className="text-gray-600 font-medium">{deliverable.type}</p>
                    <p className="text-sm text-gray-400 mt-1">Uploaded: {deliverable.uploadedDate}</p>
                  </div>

                  <div className="flex space-x-3">
                    <Button size="sm" variant="outline" className="flex-1 border-2 border-black text-black hover:bg-black hover:text-white py-3 rounded-2xl font-semibold transition-all duration-200">
                      Preview
                    </Button>
                    <Button size="sm" className="flex-1 bg-black hover:bg-gray-800 text-white py-3 rounded-2xl font-semibold transition-all duration-200">
                      Download
                    </Button>
                  </div>

                  {deliverable.status === "Pending Approval" && (
                    <div className="flex space-x-3 pt-2">
                      <Button size="sm" className="flex-1 bg-[#f7e833] hover:bg-yellow-400 text-black py-3 rounded-2xl font-semibold transition-all duration-200">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 py-3 rounded-2xl font-semibold transition-all duration-200">
                        Request Revision
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
